const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const ORDERDB = functions.config().database.orderdb;

exports.createRefundOrder = 
functions.database.instance(ORDERDB).ref('Orders/{orderId}')
            .onWrite(async (snapshot, context) =>{
                console.log('Order Id',context.params.orderId)
                const orderSnap = snapshot.after;
                const order = orderSnap.val();
                const orderId = context.params.orderId;
                const currentStatus = order.orderStatus;
                console.log('Order status',currentStatus);
                if(currentStatus == -1){
                    //Order cancelled by restaurant create refund order
                    const refundAmount = order.totalPayment;
                    const status = "Refund Generated";
                    console.log('refundAmounr',refundAmount);
                    console.log('status',status);
                    const ref = admin.app().database('https://eatitv2-75508-refund.firebaseio.com/').ref('Refunds/'+orderId);
                    ref.set({
                        orderModel:order,
                        refundAmount:refundAmount,
                        status:status
                    },function(error){
                        if(error){
                            return console.log('Refund Created Error',error)
                        }
                        else{
                            return console.log('Refund Created Successfully');
                        }
                    });




                }


            });