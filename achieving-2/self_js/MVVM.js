class MVVM{
	constructor(options){
		this.$el = options.el;
		this.$data = options.data;
		//劫持数据
		new Observer(this.$data);
		//编译数据
		new Compile(this);
	}
}