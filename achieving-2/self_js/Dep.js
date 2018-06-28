class Dep{
	constructor(){
		this.subs = []
	}
	addSub(watcher){
		this.subs.push(warcher)
	}
	notify(){
		this.subs.forEach(watcher=>{
			watcher.updateFn();
		})
	}
}