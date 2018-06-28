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
		Array.from(node.childNodes).forEach(node=>{
			let firstChild;
			while(firstChild = node.firstChild){
				console.log(firstChild);
				fragment.appendChild(firstChild);
			}	
		});
		return fragment;
	}
	compile(fragment){
		console.log(fragment);
	}

}