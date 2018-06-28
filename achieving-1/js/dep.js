class Dep{
	constructor(){
		//订阅的数组 
		this.subs = [];
	}
	// 添加订阅
	addSub(watcher){
		this.subs.push(watcher);
	}
	// 通知全体添加完成，调用watcher的update
	notify(){
		this.subs.forEach(watcher=> watcher.update());
	}
}