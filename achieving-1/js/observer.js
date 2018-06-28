class Observer{
	constructor(data){
		this.observe(data);
	}
	// 将所有数据改成set和get的形式
	observe(data){
		// 数据不存在或者数据不是对象
		if( !data || typeof data !== 'object'){
			return ;
		}
		// 将数据一一劫持 先获取到data的key 和value
		Object.keys(data).forEach( key =>{
			// 劫持，若data[key]是个对象，则需要继续递归
			// 响应式为属性添加get set
			this.defineReactive(data,key,data[key]);
			this.observe(data[key]);
		})
	}
	// 定义响应式，在赋新的值得时候加点中间过程
	defineReactive(obj,key,value){
		let that = this;
		let dep = new Dep(); //每个变化的数据都会对应一个数组，这个数组存放所有更新的操作
		Object.defineProperty(obj,key,{
			enumerable:true,
			configurable:true,
			get(){
				// Dep.target是watcher的实例，实例化watcher后才有Dep.target,只有Dep.target存在时才会执行
				Dep.target && dep.addSub(Dep.target);
				return value
			},
			//给data属性中设置值时, 更改获取的属性值
			set(newValue){
				if(newValue !== value){
					//这里的this不是实例
					that.observe(newValue);
					value = newValue
					dep.notify(); //通知全体数据更新了
				}
			}
		})
	}
}