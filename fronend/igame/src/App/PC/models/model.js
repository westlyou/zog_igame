/**
 * 这个Models 用来模拟数据提供。
 */
/*************************************************************修改 */
import Board from '../../OdooRpc/Board'
import OdooModel from '../../OdooRpc/OdooRpc'
import Channel from '../../OdooRpc/Channel'
import GameTeamPlayer from '../../OdooRpc/GameTeamPlayer'


/*************************************************************修改 */
class Models{
    static deals(){
        // E               S                W                N
        // S.H.D.C
        return ['T76543.4.K72.863 QJ98.A5.J853.QT4 A2.Q986.AQT.KJ97 K.KJT732.964.A52', 
        'Q74.K963.J7.KQJ8 AJ52.J52.A2.AT95 986.AT74.KT85.62 KT3.Q8.Q9643.743',
        '986.J5.AJT93.KT7 Q2.A732.8642.J94 K3.KT8.Q75.A8653 AJT754.Q964.K.Q2',
        'A63.A954.AT4.Q52 QT84.QJ7.K832.AT J95.K862.J97.643 K72.T3.Q65.KJ987']
    }
    /**
     * 获得明手的牌，根据规则进行判断。
     * todo:正确的牌
     */
    static openDummy(){
        return {seat:'north',cards:'K.KJT732.964.A52'}
    }
    /**
     * 获得上一墩牌，这里应该进行必要的判断。不能随便获得。
     * [东，南，西，北]
     */
    static lastTrick(){
        return [{index:1,card:'7S'},
                {index:14,card:'9S'},
                {index:28,card:'2S'},
                {index:41,card:'KS'}]
    }
    static getResult(){
        return "N3D +2 NS 600";
    }

    static get_matches(success,error){  //查询桌号
        const gameTeamPlayer= new GameTeamPlayer(success,error);
        gameTeamPlayer.get_matches();   //params: []
    }

    static join_channel(sucChannel,failChannel,table_id){ //加入频道
        const JoinChannel = new Channel(sucChannel,failChannel);
        JoinChannel.join_channel(table_id);   //params: [table_id]
    }
    static init_board=(success,error,board_id,channel_id)=>{ //初始化牌桌
        const  board= new Board(success,error); 
        board.init_board(board_id,channel_id)   //params: [board_id,channel_id]
    } 

    static polling=(success,error,pollingId)=>{  //消息连接
        const Poll = new OdooModel(success,error);
        Poll.poll(pollingId);   //params: [pollingId]
    }

    static bid=(success,error,board_id,pos,card,channel_id)=>{  //发送叫牌消息
        const board= new Board(success,error); 
        board.bid(board_id,pos,card,channel_id);    //params: [board_id,pos,card,channel_id]
    }

    static call_result=(success,error,board_id,channel_id)=>{   //查询叫牌结果
        const board= new Board(success,error);  
        board.call_result(board_id,channel_id);      //params: [board_id,channel_id]
    }

    static play=(success,error,board_id,mydir,card)=>{   //发送打牌消息
        const board= new Board(success,error);  
         board.play(board_id,mydir,card);         //params: [board_id,mydir,card,channel_id]
    }
    static sendplay =(success,error,board_id,card_id,channel_id)=>{   //接收打牌消息
        const board= new Board(success,error);      
        board.sendplay(board_id,card_id,channel_id);      //params: [board_id,card_id,channel_id]
    }

    static board_points=(success,error,board_id)=>{   //查询单副牌的成绩
        const  board= new Board(success,error); 
        board.board_points(board_id);      //params: [board_id]
    }

    static table_points=(success,error,table_id)=>{     //查询一桌所有牌的成绩
        const  board= new Board(success,error); 
        board.table_points(table_id);   //params: [table_id]
    }
    static claim1=(success,error,board_id,pos,num,channel_id)=>{  //庄家发送claim请求
        const  board= new Board(success,error); 
        board.claim1(board_id,pos,num,channel_id);   //params: [board_id,pos,num,channel_id]
    }

    static claim=(success,error,board_id,pos,channel_id)=>{  //claim
        const  board= new Board(success,error); 
        board.claim(board_id,pos,channel_id);   //params: [board_id,pos,num,channel_id]
    }

    static send_message=(success,error,channel_id,msg)=>{  //直接向频道发送消息
        const  board= new Board(success,error); 
        board.send_message(channel_id,msg);   //params: [channel_id,msg]
    }

    static call_ready = (success,error,board_id,pos)=>{
        const board = new Board(success,error);
        board.call_ready(board_id,pos);
    }

    static claiming = (success,error,board_id,state,rank)=>{
        const board = new Board(success,error);
        board.claiming(board_id,state,rank);
    }

    static ask_claim = (success,error,board_id,pos,state)=>{
        console.log(board_id)
        console.log(pos)
        console.log(state)
        const board = new Board(success,error);
        board.ask_claim(board_id,pos,state);
    }
}

export default Models