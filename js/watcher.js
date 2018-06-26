class Watcher{
	constructor(vm,expr,cb){
		this.vm = vm;
		this.expr = expr;
		this.cb = cb;
		//先获取老的值
		this.value = this.get();
	}
	get(){
		Dep.target = this;//只要一创建watcher实例，就把实例赋给Dep.target
		let value = this.getVal(this.vm,this.expr);
		//更新完成后，要取消掉
		Dep.target = null;
		return value;
	}
	getVal(vm,expr){
		expr = expr.split('.');
		return expr.reduce((pre,next)=>{
			return pre[next];
		},vm.$data);
	}
	update(){
		let newValue = this.getVal(this.vm,this.expr);
		let oldValue = this.value;
		if(newValue !== oldValue){
			this.cb(newValue);
		}
	}
}