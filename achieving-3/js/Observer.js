class Observer{
	constructor(data){
		this.observer(data);
	}
	observer(data){
		// 递归数据,并利用defineProperty给数据添加getter,setter
		if( !data || typeof data !== 'object'){
			return ;
		}
		Object.keys(data).forEach(key=>{
			this.defineReactive(data,key,data[key]);
			this.observer(data[key]);
		})
	}
	defineReactive(obj,key,value){
		Object.defineProperty(obj,key,{
			enumerable: true,
			configurable: true,
			get(){
				return value;
			},
			set(newValue){
				if(newValue !== value){
					value = newValue;
					this.observer(newValue);
				}
			}
		})
	}
}