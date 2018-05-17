module network {
	
	/**
	 * 发送或接收网络对战消息处理
	 */
	export class BattleMsg extends egret.EventDispatcher {

		private static _instance = null;

		private battleEventMap:{[key:number]:string} = [];


		private constructor() {
			super();
			this.AddEventMap();
		}

		/**
		 * 获取网络消息管理实例
		 */
		public static getInstance():BattleMsg{
			if(BattleMsg._instance == null){
				BattleMsg._instance = new BattleMsg();
			}
			return BattleMsg._instance;
		}


		private AddEventMap(){
			this.battleEventMap[NetMsgEvent.GAME_READY_R] = BattleMsgEvent.GAME_READY;
		}

		/**
		 * 接收消息
		 * @param {any} msg
		 */
		public ReceiveMessage(msg:string):number{
			/**
			 * 消息解析
			 */
			let event = JSON.parse(msg);
			if(!event.hasOwnProperty("action") || !event.hasOwnProperty("data")){
				return -1;
			}
			let obj = this.ResolverMsg(Number(event.action), event.data);
			// console.info("event.action",msg);
			 console.info("ReceiveMessage:",this.battleEventMap[event.action],obj);
			this.dispatchEvent(new egret.Event(this.battleEventMap[event.action], false, false, obj));
			//触发监听事件
			return 0;
		}

		/**
		 * 消息解析
		 */
		private ResolverMsg(action:NetMsgEvent, data:any):any{
			let pk:IResolver = new DefaultResolver();
			// switch(action){
			// 	case NetMsgEvent.GAME_READY_R:
			// 	pk = new GameReadyResolver();
			// 	break;
			// 	case NetMsgEvent.RESET_ROOM_R:
			// 	break;
			// 	case NetMsgEvent.REPROT_SCORE_R:
			// 	break;
			// 	default:
			// 	console.warn("invaild message action!",action,data);
			// 	break;
			// }
			if(pk == null){
				return "";
			}
			return pk.getParse(data);
		}


		//发送消息
		private sendMessage(ev:NetMsgEvent,data:any):string{
			console.info("sendMessage action:",ev,data);
			let pk:IResolver = new DefaultResolver();
			switch(ev){
				case NetMsgEvent.CALL_LAND_S:
				break;
				case NetMsgEvent.GAME_READY_S:
				pk = new GameReadyResolver();
				break;
				case NetMsgEvent.RESET_ROOM_S:
				break;
				case NetMsgEvent.REPROT_SCORE_S:
				break;
				default:
				break;
			}
			if(pk == null){
				return "";
			}
			let tmpdata = pk.toPackage(ev,data);
			//console.info("tmpdata:",tmpdata);
			return tmpdata;
		}

		//发送给gameServer
		public sendToGameServer(action:NetMsgEvent,data:any){
			this.ReceiveMessage(this.sendMessage(action, data));
		}

		//发送给玩家
		public sendToPlayers(action:NetMsgEvent,data:any){
			this.sendMessage(action, data);
		} 

	}
}