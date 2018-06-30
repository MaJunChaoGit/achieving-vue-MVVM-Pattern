let CompileUtil = {
	text(node,vm,expr){
		let updateFn = this.updater['textUpdater'];
		let value = this.getTextVal(vm,expr);
		expr.replace(/\{\{([^}]+)\}\}/,(...arguments)=>{
			new Watcher(vm,arguments[1].trim(),(newValue)=>{
				updateFn && updateFn(node,newValue)		
			})
		})
		updateFn && updateFn(node,value)
	},
	model(node,vm,expr){
		let updateFn = this.updater['modelUpdater'];
		new Watcher(vm,expr,(newValue)=>{
			updateFn && updateFn(node,newValue);	
		});
		node.addEventListener('input',(e)=>{
			let newValue = e.target.value;
			this.setVal(vm,expr,newValue);
		})
		updateFn && updateFn(node,this.getVal(vm,expr));
	},
	setVal(vm,expr,newValue){
		expr = expr.split('.');
		return expr.reduce((pre,next,currentIndex)=>{
			if(currentIndex === expr.length -1){
				return pre[next] = newValue;
			}
			return pre[next];
		},vm.$data)
	},
	getTextVal(vm,expr){
		return expr.replace(/\{\{([^}]+)\}\}/g,(...arguments)=>{
			return this.getVal(vm,arguments[1].trim());
		})
	},
	getVal(vm,expr){
		expr = expr.split('.');
		return expr.reduce((pre,next)=>{
			return pre[next];
		},vm.$data);
	},
	updater: {
		modelUpdater(node,value){
			node.value = value;
		},
		textUpdater(node,value){
			node.textContent = value;
		}
	}
}
class Compile{
	constructor(el,vm,data){
		this.$el = this.isElementNode(el) ? el : document.querySelector(el);
		this.$vm = vm;
		this.$data = data;

		if(this.$el){
			//将页面中的DOM先转为fragment
			let fragment = this.nodeToFragment(this.$el);
			//对其中的模板进行编译
			this.compile(fragment);
			//最后将其添加到DOM中
			this.$el.appendChild(fragment);
		}
	}
	isElementNode(el){
		return el.nodeType === 1;
	}
	nodeToFragment(node){
		let fragment = document.createDocumentFragment();
		let firstChild;
		//循环添加node中的节点,直到为空
		while(firstChild = node.firstChild){
			fragment.appendChild(firstChild);
		}	
		return fragment;
	}
	compile(fragment){
		Array.from(fragment.childNodes).forEach(node=>{
			//判断是文字节点还是元素节点
			if(this.isElementNode(node)){
				this.compileElement(node);
				this.compile(node);
			}else{
				this.compileText(node);
			}
		})
	}
	isDirective(attrName){
		return attrName.includes('v-');
	}
	compileElement(node){
		let attrs = node.attributes;
		Array.from(attrs).forEach(attr=>{
			let attrName = attr.nodeName;
			if(this.isDirective(attrName)){
				let type = attrName.slice(2);
				let expr = attr.value;
				CompileUtil[type](node,this.$vm,expr);
			}
		})
	}
	compileText(node){
		let text = node.data;
		let reg = /\{\{([^}]+)\}\}/g;
		if(reg.test(text)){
			CompileUtil['text'](node,this.$vm,text);
		}
	}

}