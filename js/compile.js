let CompileUtil = {
	// 获取实例上对应的数据,返回vm.$data.xxx.yyy
	getVal(vm,expr){
		expr = expr.split('.');
		return expr.reduce((pre,next)=>{
			return pre[next];
		},vm.$data)
	},
	// 公共逻辑的部分
	updater:{
		textUpdater(node,value){
			node.textContent = value;
		},
		modelUpdate(node,value){
			node.value = value;
		}
	},
	//带v-model的元素节点
	model(node,vm,expr){
		let updateFn = this.updater['modelUpdater'];
		updateFn && updateFn(node,this.getVal(vm,expr));
	},
	//文本节点编译
	text(node,vm,expr){
		let updateFn = this.updateFn['textUpdater'];
		let value = text.replace(/\{\{([^}]+)\}\}/g,(...arguments)=>{
			//拿到第一个分组,并且要去的没有空格的字符串
			return this.getVal(vm,arguments[1].trim());
		})
		console.log(value);
		updateFn && updateFn(node,value);
	}
}
class Compile{
	constructor(el, vm){
		this.$el = this.isElementNode(el) ? el : document.querySelector(el);
		this.$vm = vm;
		if(this.el){
			//如果这个元素能获取到, 我们才开始编译
			//1.先把这些真实的DOM移入到内存中fragment
			let fragment = this.nodeToFragment(this.$el);
			//2.编译=>提取想要的元素节点 v-model和文本节点 {{ }}
			this.compile(fragment);
			//3.把编译好的fragment再返回到页面去
			this.$el.appendChild(fragment);
		}
	}
	// 将节点el里所有的内容放到内存里
	nodeToFragment(el){
		let fragment = document.createDocumentFragment();
		let firstChild;
		while(firstChild === el.firstChild){
			fragment.appendChild(firstChild);
		}

		//内存中的节点
		return fragment;
	}
	//判断是否为元素节点
	isElementNode(node){
		return node.nodeType === 1;
	}
	//编译方法
	compile(fragment){
		let childNodes = fragment.childNodes;
		Array.from(childNodes).forEach(node => {
			if(this.isElementNode(node)){
				//元素节点,它里面可能会有嵌套子节点,所以需要深入递归
				//这里需要编译元素节点
				this.compileElement(node);
				this.compile(node)
			}else{
				//文本节点
				//这里需要编译文本节点
				this.compileText(node)
			}
		})
	}
	//判断属性名字是不是包含'v-'
	isDirective(name){
		return name.include('v-');
	}
	//编译带有'v-'属性的元素节点,DOM元素不能用正则判断
	compileElement(node){
		let attrs = node.attributes;
		Array.from*(attrs).forEach(attr => {
			let attrName = attr.name;
			if (this.isDirective(attrName)){
				let expr = attr.value;
				let type = attrName.slice(2);
				//编译工具方法
				CompileUtil[type](node,this.vm,expr)
			}
		})
	}
	//编译文本节点
	compileText(node){
		let text = node.textContent;
		let reg = /\{\{([^}]+)\}\}/g;
		if(reg.test(text)){
			//编译工具方法
			CompileUtil['text'](node,this.vm,text)
		}
	}
}