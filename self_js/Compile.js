let CompileUtil = {
	model(node,vm,expr){
		// console.log(node,vm,expr)
	},
	text(node,vm,expr){
		//有捕获组的情况下是4个参数
		let value = expr.replace(/\{\{([^}]+)\}\}/g,(...arguments)=>{
			return arguments[1].trim(); //还需要分割对象
		})
		
	}
}

class Compile{
	constructor(vm){
		this.$el = this.isElementNode(vm.$el) ? vm.$el : document.querySelector(vm.$el);
		this.$vm = vm;

		if(this.$el){
			//将节点先放入内存中
			let fragment = this.nodeToFragment(this.$el);
			this.compile(fragment);
		}
	}
	isElementNode(el){
		return el.nodeType === 1;
	}
	nodeToFragment(node){
		let fragment = document.createDocumentFragment();
		let firstChild;
		//递归构建fragment
		while(firstChild = node.firstChild){
			fragment.appendChild(firstChild);
		}
		return fragment;
	}
	compile(fragment){
		//递归分类别编译节点
		Array.from(fragment.childNodes).forEach(node=>{
			if(this.isElementNode(node)){
				this.compileElement(node);
				this.compile(node)
			}else{
				this.compileText(node);
			}	
		})
	}
	compileElement(node){
		let attrs = node.attributes;
		Array.from(attrs).forEach(attr=>{
			let attrName = attr.nodeName;
			//如果是v-指令
			if(this.isDirective(attrName)){
				let expr = attr.value;
				let type = attrName.slice(2);
				//将其进行编译
				CompileUtil[type](node,this.$vm,expr)
			}
		})
	}
	compileText(node){
		let text = node.textContent;
		let reg = /\{\{([^}]+)\}\}/g;
		// 如果匹配模板语法
		if(reg.test(text)){
			// 将其经行编译
			CompileUtil['text'](node,this.$vm,text)
		}
	}
	isDirective(attrName){
		return attrName.includes('v-');
	}
}