class Observer{
	constructor(data){
		this.$data = data;

		this.observe(this.$data);
	}
	//递归进行数据劫持
	observe(data){
		//只能对第一次定义的data中的数据进行劫持
		if( !data || typeof data !== 'object'){
			return;
		}

		Object.keys(data).forEach((key)=>{

			this.defineReactive(data,key,data[key]);
			//递归进行数据劫持
			this.observe(data[key]);

		})
	}
	//创建响应式数据
	defineReactive(obj,key,value){
		let that = this;
		Object.defineProperty(obj,key,{
			enumerable: true,
			configurable: true,
			get(){
				return value;
			},
			set(newValue){
				if(newValue !== value){
					// 每次有新值时需要做数据劫持
					that.observe(newValue);
					value = newValue;
				}
			}
		})
	}
}