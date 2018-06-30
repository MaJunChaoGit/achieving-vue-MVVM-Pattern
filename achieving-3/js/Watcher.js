class Watcher{
	constructor(vm,expr,cb){
		this.$vm = vm;
		this.$expr = expr;
		this.$cb = cb;
		this.$oldValue = this.get();
	}
	get(){
		Dep.target = this;
		let oldValue = this.getVal(this.$vm,this.$expr);
		Dep.target = null;
		return oldValue;
	}
	getVal(vm,expr){
		expr = expr.split('.');
		return expr.reduce((pre,next)=>{
			return pre[next];
		},vm.$data)
	}
	updater(){
		let newValue = this.getVal(this.$vm,this.$expr);
		let oldValue = this.$oldValue;
		if(newValue !== oldValue){
			this.$cb(newValue);
		}
	}
}