let CompileUtil = {
	model(node,vm,expr){
		// console.log(node,vm,expr)
		let updateFn = this.updater['modelUpdater'];
		new Watcher(vm,expr,(newValue)=>{
			updateFn && updateFn(node,this.getVal(vm,expr))	
		})
		node.addEventListener('input',(e)=>{
			let newValue = e.target.value;
			this.setVal(vm,expr,newValue);
		})
		updateFn && updateFn(node,this.getVal(vm,expr))
	},
	text(node,vm,expr){
		let updateFn = this.updater['textUpdater'];
		let value = this.getTextVal(vm,expr);

		expr.replace(/\{\{([^}]+)\}\}/g,(...arguments)=>{
			new Watcher(vm,arguments[1].trim(),(newValue)=>{
				updateFn && updateFn(node,this.getTextVal(vm,newValue))
			})
		})
		//有捕获组的情况下是4个参数
		
		updateFn && updateFn(node,value)

	},
	getVal(vm,expr){
		expr = expr.split('.');
		return expr.reduce((pre,next)=>{
			return pre[next];
		},vm.$data)
	},
	getTextVal(vm,expr){
		console.log(expr)
		return expr.replace(/\{\{([^}]+)\}\}/g,(...arguments)=>{
			return this.getVal(vm,arguments[1].trim()); //还需要分割对象
		})
	},
	updater:{
		textUpdater(node,value){
			node.textContent = value;
		},
		modelUpdater(node,value){
			node.value = value
		}
	},
	setVal(vm,expr,value){
		expr = expr.split('.');
		return expr.reduce((pre,next,currentIndex) =>{
			if(currentIndex === expr.length - 1){
				return pre[next] = value;
			}
			return pre[next];
		},vm.$data);
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
			this.$el.appendChild(fragment);
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
		debugger;
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