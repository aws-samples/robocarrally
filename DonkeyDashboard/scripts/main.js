"use strict";
function SigV4Utils() {}

function update(e, o) {
    if(e) {
        var t=e.series[0].points[0];
        t.update(o)
    }
}

function initClient(e) {
    var o=String(Math.random()).replace(".", ""),
    t=new Paho.MQTT.Client(e, o),
    r= {
        onSuccess:function() {
            console.log("connected to "+TOPIC),
            t.subscribe(TOPIC)
        }
        ,
        useSSL:!0,
        timeout:16,
        mqttVersion:4,
        onFailure:function() {
            console.error("connect failed")
        }
    }
    ;
    t.onMessageArrived=function(e) {
        var o=JSON.parse(e.payloadString);
        console.log(o),
        update($("#container-engine_rpm").highcharts(), parseInt(o.engine_rpm)),
        update($("#container-speedometer").highcharts(), parseInt(o.vehicle_speed))
        update($("#container-odometer").highcharts(), parseInt(o.vehicle_odometer))
        update($("#container-remaining_power").highcharts(), parseInt(o.remaining_power))
        update($("#container-right_front_wheel").highcharts(), parseInt(o.right_front_wheel_rpm))
        update($("#container-right_rear_wheel").highcharts(), parseInt(o.right_rear_wheel_rpm))
        update($("#container-left_front_wheel").highcharts(), parseInt(o.left_front_wheel_rpm))
        update($("#container-left_rear_wheel").highcharts(), parseInt(o.left_rear_wheel_rpm))
        update($("#container-angle").highcharts(), parseInt(o.angle))
        update($("#container-throttle").highcharts(), parseInt(o.throttle))
      

    }
    ,
    t.onConnectionLost=function(e) {
        console.log("connection lost!"),
        console.log(e)
    }
    ,
    t.connect(r)
}

SigV4Utils.sign=function(e, o) {
    var t=CryptoJS.HmacSHA256(o, e);
    return t.toString(CryptoJS.enc.Hex)
}

,
SigV4Utils.sha256=function(e) {
    var o=CryptoJS.SHA256(e);
    return o.toString(CryptoJS.enc.Hex)
}

,
SigV4Utils.getSignatureKey=function(e, o, t, r) {
    var i=CryptoJS.HmacSHA256(o, "AWS4"+e),
    n=CryptoJS.HmacSHA256(t, i),
    a=CryptoJS.HmacSHA256(r, n),
    l=CryptoJS.HmacSHA256("aws4_request", a);
    return l
}

,
SigV4Utils.getSignedUrl=function(e, o, t, r, i, n, a, l) {
    var s=moment().utc(),
    c=s.format("YYYYMMDD"),
    d=c+"T"+s.format("HHmmss")+"Z",
    p="AWS4-HMAC-SHA256",
    g="GET",
    m=c+"/"+i+"/"+r+"/aws4_request",
    u="X-Amz-Algorithm=AWS4-HMAC-SHA256";
    u+="&X-Amz-Credential="+encodeURIComponent(n+"/"+m),
    u+="&X-Amz-Date="+d,
    u+="&X-Amz-SignedHeaders=host";
    var h="host:"+o+"\n",
    C=SigV4Utils.sha256(""),
    y=g+"\n"+t+"\n"+u+"\n"+h+"\nhost\n"+C,
    b=p+"\n"+d+"\n"+m+"\n"+SigV4Utils.sha256(y),
    f=SigV4Utils.getSignatureKey(a, c, i, r),
    S=SigV4Utils.sign(f, b);
    u+="&X-Amz-Signature="+S,
    l&&(u+="&X-Amz-Security-Token="+encodeURIComponent(l));
    var x=e+"://"+o+t+"?"+u;
    return x
}

,

Highcharts.createElement("link", {
    href: "https://fonts.googleapis.com/css?family=Unica+One", rel: "stylesheet", type: "text/css"
}

, null, document.getElementsByTagName("head")[0]),
Highcharts.theme= {
    colors:["#FF9900",
    "#90ee7e",
    "#f45b5b",
    "#7798BF",
    "#aaeeee",
    "#ff0066",
    "#eeaaee",
    "#55BF3B",
    "#DF5353",
    "#232F3E",
    "#7798BF",
    "#aaeeee"],
    chart: {
        backgroundColor: {}
        ,
        style: {
            fontFamily: "'Unica One', sans-serif"
        }
        ,
        plotBorderColor:"#FF9900"
    }
    ,
    title: {
        style: {
            color: "#FF9900", textTransform: "uppercase", fontSize: "24px"
        }
    }
    ,
    subtitle: {
        style: {
            color: "#FF9900", textTransform: "uppercase", fontSize: "16px"
        }
    }
    ,
    xAxis: {
        gridLineColor:"#FF9900",
        labels: {
            style: {
                color: "#FF9900"
            }
        }
        ,
        lineColor:"#FF9900",
        minorGridLineColor:"#FF9900",
        tickColor:"#FF9900",
        title: {
            style: {
                color: "#FF9900" 
            }
        }
    }
    ,
    yAxis: {
        gridLineColor:"#FF9900",
        labels: {
            style: {
                color: "#FF9900"
            }
        }
        ,
        lineColor:"#FF9900",
        minorGridLineColor:"#FF9900",
        tickColor:"#FF9900",
        tickWidth:1,
        title: {
            style: {
                color: "#FF9900" 
            }
        }
    }
    ,
    tooltip: {
        backgroundColor:"rgba(0, 0, 0, 0.85)",
        style: {
            color: "#F0F0F0"
        }
    }
    ,
    plotOptions: {
        series: {
            dataLabels: {
                color: "#FF9900"
            }
            ,
            marker: {
                lineColor: "#FF9900"
            }
        }
        ,
        boxplot: {
            fillColor: "#FF9900"
        }
        ,
        candlestick: {
            lineColor: "white"
        }
        ,
        errorbar: {
            color: "white"
        }
    }
    ,
    legend: {
        itemStyle: {
            color: "#FF9900"
        }
        ,
        itemHoverStyle: {
            color: "#FFF"
        }
        ,
        itemHiddenStyle: {
            color: "#FF9900"
        }
    }
    ,
    credits: {
        style: {
            color: "#666"
        }
    }
    ,
    labels: {
        style: {
            color: "#FF9900"
        }
    }
    ,
    drilldown: {
        activeAxisLabelStyle: {
            color: "#F0F0F3"
        }
        ,
        activeDataLabelStyle: {
            color: "#F0F0F3"
        }
    }
    ,
    navigation: {
        buttonOptions: {
            symbolStroke:"#DDDDDD",
            theme: {
                fill: "#FF9900"
            }
        }
    }
    ,
    rangeSelector: {
        buttonTheme: {
            fill:"#FF9900",
            stroke:"#000000",
            style: {
                color: "#FF9900"
            }
            ,
            states: {
                hover: {
                    fill:"#FF9900",
                    stroke:"#000000",
                    style: {
                        color: "white"
                    }
                }
                ,
                select: {
                    fill:"#000003",
                    stroke:"#000000",
                    style: {
                        color: "white"
                    }
                }
            }
        }
        ,
        inputBoxBorderColor:"",
        inputStyle: {
            backgroundColor: "#FF9900", color: "silver"
        }
        ,
        labelStyle: {
            color: "orange"
        }
    }
    ,
    navigator: {
        handles: {
            backgroundColor: "#666", borderColor: "#FF9900"
        }
        ,
        outlineColor:"#FF9900",
        maskFill:"#FF9900",
        series: {
            color: "#7798BF", lineColor: "#A6C7ED"
        }
        ,
        xAxis: {
            gridLineColor: "#FF9900"
        }
    }
    ,
    scrollbar: {
        barBackgroundColor: "#FF9900", barBorderColor: "#FF9900", buttonArrowColor: "#FF9900", buttonBackgroundColor: "#FF9900", buttonBorderColor: "#FF9900", rifleColor: "#FF9900", trackBackgroundColor: "#FF9900",  trackBorderColor: "#FF9900"
    }
    ,
    legendBackgroundColor:"rgba(0, 0, 0, 0.5)",
    background2:"#FFF",
    dataLabelsColor:"#FF9900",
    textColor:"#C0C0C0",
    contrastTextColor:"#F0F0F3",
    maskColor:"rgba(255,255,255,0.1)"
}

,
Highcharts.setOptions(Highcharts.theme),
$(function() {
    var e= {
        chart: {
            type: "solidgauge"
        }
        , title:null, pane: {
            center:["50%", "105%"], size:"200%", startAngle:-85, endAngle:85, background: {
                backgroundColor: "#232F3E", innerRadius: "60%", outerRadius: "100%", shape: "arc"
            }
        }
        , tooltip: {
            enabled: !1
        }
        , yAxis: {
            stops:[[.1, "#55BF3B"], [.5, "#DDDF0D"], [.9, "#DF5353"]], lineWidth:0, minorTickInterval:null, tickAmount:2, title: {
                y: -70
            }
            , labels: {
                y: 16
            }
        }
        , plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 5, borderWidth: 0, useHTML: !0
                }
            }
        }
    }
    , 
     v= {
        chart: {
            type: "solidgauge",
            marginTop: 15
        }
        , 
        title:null, 
        pane: {
        startAngle: 0,
        endAngle: 360,
        background: [{ // Track for Move
            outerRadius: '60%',
            innerRadius: '30%',
            backgroundColor: "#F0F0F3",
            borderWidth: 0
        }, { // Track for Exercise
            outerRadius: '30%',
            innerRadius: '5%',
            backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[1])
                .setOpacity(0.3)
                .get(),
            borderWidth: 0
        }]
    },
        tooltip: {
        borderWidth: 0,
        backgroundColor: 'none',
        shadow: false,
        style: {
            fontSize: '16px'
        },
        pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}%</span>',
        positioner: function (labelWidth) {
            return {
                x: 200 - labelWidth / 2,
                y: 180
            };
        }
    },
        yAxis: {
            stops:[[.1, "#55BF3B"], [.5, "#DDDF0D"], [.9, "#DF5353"]], lineWidth:0, minorTickInterval:null, tickAmount:2, title: {
                y: -70
            }
            , labels: {
                y: 16
            }
        }
        , plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 5, borderWidth: 0, useHTML: !0
                }
            }
        }
    }
    , 
    o= {
        chart: {
            type:"gauge", plotBorderWidth:3, plotBackgroundColor: {
                linearGradient: {
                    x1: 0, y1: 0, x2: 0, y2: 1
                }
                , stops:[[0, "#FF9900"], [.3, "#efefef"], [1, "#FF9900"]]
            }
            , plotBackgroundImage:null, height:200
        }
        , pane:[ {
            startAngle: -40, endAngle: 40, background: null, center: ["52%", "145%"], size: 200
        }
        ], tooltip: {
            enabled: !1
        }
        , plotOptions: {
            gauge: {
                dataLabels: {
                    enabled: !1
                }
                , dial: {
                    radius: "100%"
                }
            }
        }
    }
    ; 
 $("#container-right_rear_wheel").highcharts(Highcharts.merge(v, {
 
        chart: {
                type: "solidgauge",
                marginTop: 50
                },
        title: {
            text: "Right Rear Wheel Speed",
            style: {
                    fontSize: '12px'
            }
        },
        
     tooltip: {
        borderWidth: 0,
        backgroundColor: 'none',
        shadow: false,
        style: {
            fontSize: '16px'
        },
        pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}%</span>',
        positioner: function (labelWidth) {
            return {
                x: 200 - labelWidth / 2,
                y: 180
            };
        }
    },

        pane: {
                startAngle: 0,
                endAngle: 360,
                background: [{ // Track for Move
            outerRadius: '112%',
            innerRadius: '59%',
            backgroundColor: "#232F3E",
            borderWidth: 5
        }, { // Track for Exercise
            outerRadius: '58%',
            innerRadius: '32%',
            backgroundColor: "F0F0F3",
            borderWidth: 0
        }]
    },


        yAxis:[ {
            min:0,
            max:3000, 
            lineWidth: 0,
            tickPositions: []
            }],

        plotOptions: {
        solidgauge: {
            dataLabels: {
                enabled: false
            },
            linecap: 'round',
            stickyTracking: false,
            rounded: true
        }
    },

        series:[ {
            name: "right_rear_wheel_rpm", 
            data: [{color: Highcharts.getOptions().colors[0],
            radius: '112%',
            innerRadius: '59%',
            y: 0
        }]
    }
]           
    }
    )), 
$("#container-right_front_wheel").highcharts(Highcharts.merge(v, {
 
        chart: {
                type: "solidgauge",
                marginTop: 50
                },
        title: {
            text: "Right Front Wheel Speed",
            style: {
                    fontSize: '12px'
            }
        },
        
     tooltip: {
        borderWidth: 0,
        backgroundColor: 'none',
        shadow: false,
        style: {
            fontSize: '8px'
        },
        pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}%</span>',
        positioner: function (labelWidth) {
            return {
                x: 200 - labelWidth / 2,
                y: 180
            };
        }
    },

        pane: {
                startAngle: 0,
                endAngle: 360,
                background: [{ // Track for Move
            outerRadius: '112%',
            innerRadius: '59%',
            backgroundColor: "#232F3E",
            borderWidth: 5
        }, { // Track for Exercise
            outerRadius: '58%',
            innerRadius: '32%',
            backgroundColor: "F0F0F3",
            borderWidth: 0
        }]
    },


        yAxis:[ {
            min:0,
            max:3000, 
            lineWidth: 0,
            tickPositions: []
            }],

        plotOptions: {
        solidgauge: {
            dataLabels: {
                enabled: false
            },
            linecap: 'round',
            stickyTracking: false,
            rounded: true
        }
    },

        series:[ {
            name: "right_front_wheel_rpm", 
            data: [{color: Highcharts.getOptions().colors[0],
            radius: '112%',
            innerRadius: '59%',
            y: 0
        }]
    }
]           
    }
    )), 
$("#container-left_front_wheel").highcharts(Highcharts.merge(v, {
 
        chart: {
                type: "solidgauge",
                marginTop: 50
                },
        title: {
            text: "Left Front Wheel Speed",
            style: {
                    fontSize: '12px'
            }
        },
        
     tooltip: {
        borderWidth: 0,
        backgroundColor: 'none',
        shadow: false,
        style: {
            fontSize: '16px'
        },
        pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}%</span>',
        positioner: function (labelWidth) {
            return {
                x: 200 - labelWidth / 2,
                y: 180
            };
        }
    },

        pane: {
                startAngle: 0,
                endAngle: 360,
                background: [{ // Track for Move
            outerRadius: '112%',
            innerRadius: '59%',
            backgroundColor: "#232F3E",
            borderWidth: 5
        }, { // Track for Exercise
            outerRadius: '58%',
            innerRadius: '32%',
            backgroundColor: "F0F0F3",
            borderWidth: 0
        }]
    },


        yAxis:[ {
            min:0,
            max:3000, 
            lineWidth: 0,
            tickPositions: []
            }],

        plotOptions: {
        solidgauge: {
            dataLabels: {
                enabled: false
            },
            linecap: 'round',
            stickyTracking: false,
            rounded: true
        }
    },

        series:[ {
            name: "left_front_wheel_rpm", 
            data: [{color: Highcharts.getOptions().colors[0],
            radius: '112%',
            innerRadius: '59%',
            y: 0
        }]
    }
]           
    }
    )), 

$("#container-left_rear_wheel").highcharts(Highcharts.merge(v, {
 
        chart: {
                type: "solidgauge",
                marginTop: 50
                },
        title: {
            text: "Left Rear Wheel Speed",
            style: {
                    fontSize: '12px'
            }
        },
        
     tooltip: {
        borderWidth: 0,
        backgroundColor: 'none',
        shadow: false,
        style: {
            fontSize: '16px'
        },
        pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}%</span>',
        positioner: function (labelWidth) {
            return {
                x: 200 - labelWidth / 2,
                y: 180
            };
        }
    },

        pane: {
                startAngle: 0,
                endAngle: 360,
                background: [{ // Track for Move
            outerRadius: '112%',
            innerRadius: '59%',
            backgroundColor: "#232F3E",
            borderWidth: 0
        }, { // Track for Exercise
            outerRadius: '58%',
            innerRadius: '32%',
            backgroundColor: "F0F0F3",
            borderWidth: 0
        }]
    },


        yAxis:[ {
            min:0,
            max:3000, 
            lineWidth: 0,
            tickPositions: []
            }],

        plotOptions: {
        solidgauge: {
            dataLabels: {
                enabled: false
            },
            linecap: 'round',
            stickyTracking: false,
            rounded: true
        }
    },

        series:[ {
            name: "left_rear_wheel_rpm", 
            data: [{color: Highcharts.getOptions().colors[0],
            radius: '112%',
            innerRadius: '59%',
            y: 0
        }]
    }
]           
    }
    )), 



$("#container-angle").highcharts(Highcharts.merge((e), {
        yAxis:[ {
            min:-1, max:1, minorTickPosition:"outside", tickPosition:"outside", labels: {
                rotation: "auto", distance: 20
            }
            , plotBands:[ {
                from: 0, to: 0, color: "#C02316", innerRadius: "100%", outerRadius: "105%"
            }
            ], pane:0, title: {
                text: '<br/><span style="font-size:8px"></span>', y: -40
            }
        }
        ], title: {
            text: "Steering Angle"
        }
        , series:[ {
            name: "angle", data: [0], yAxis: 0
        }
        ]
    }
    )), 
$("#container-throttle").highcharts(Highcharts.merge((e), {
        chart: {
                
                plotBackgroundColor: null,
                plotBackgroundImage: null,
                plotBorderWidth: 0,
                plotShadow: false
                },
            yAxis:[ {
            min:-1, max:1, minorTickPosition:"outside", tickPosition:"outside", labels: {
                rotation: "auto", distance: 20
            }
            , plotBands:[ {
                from: 0, to: 0, color: "#C02316", innerRadius: "100%", outerRadius: "105%"
            }
            ], pane:0, title: {
                text: '<br/><span style="font-size:8px"></span>', y: -40
            }
        }
        ], title: {
            text: "Throttle Angle"
        }
        , series:[ {
            marginTop: "50px",
            name: "throttle", data: [0], yAxis: 0
        }
        ]
    }
    )),
$("#container-speedometer").highcharts(Highcharts.merge(e, {
        title: {
            text: "Speed"
        }
        , yAxis:[ {
            min:0, max:30, minorTickPosition:"outside", tickPosition:"outside", labels: {
                rotation: "auto", distance: 20
            }
            , plotBands:[ {
                from: 20, to: 30, color: "#68f442", innerRadius: "100%", outerRadius: "105%"
            }
            ,{
                from: 10, to: 20, color: "#68f442", innerRadius: "100%", outerRadius: "105%"
            }
            ,{
                from: 0, to: 10, color: "#68f442", innerRadius: "100%", outerRadius: "105%"
            }
            ], pane:0, title: {
                text: '<br/><span style="font-size:8px">DTE</span>', y: -40
            }
        }
        ], series:[ {
            name: "vehicle_speed", data: [0], yAxis: 0
        }
        ]
    }
    ))
 ,
 $("#container-odometer").highcharts(Highcharts.merge(e, {
        title: {
            text: "Distance"
        }
        , yAxis:[ {
            min:0, max:10000, minorTickPosition:"outside", tickPosition:"outside", labels: {
                rotation: "auto", distance: 20
            }
            , plotBands:[ {
                from: 20, to: 30, color: "#68f442", innerRadius: "100%", outerRadius: "105%"
            }
            ,{
                from: 10, to: 20, color: "#68f442", innerRadius: "100%", outerRadius: "105%"
            }
            ,{
                from: 0, to: 10, color: "#68f442", innerRadius: "100%", outerRadius: "105%"
            }
            ], pane:0, title: {
                text: '<br/><span style="font-size:8px">DTE</span>', y: -40
            }
        }
        ], series:[ {
            name: "vehicle_odometer", data: [0], yAxis: 0
        }
        ]
    }
    ))
 ,
 $("#container-remaining_power").highcharts(Highcharts.merge(e, {
        title: {
            text: "Battery Power"
        }
        , yAxis:[ {
            min:0, max:5000, minorTickPosition:"outside", tickPosition:"outside", labels: {
                rotation: "auto", distance: 20
            }
            , plotBands:[ {
                from: 4500, to: 5000, color: "#C02316", innerRadius: "100%", outerRadius: "105%"
            }
            ,{
                from: 4000, to: 4500, color: "#fcfc49", innerRadius: "100%", outerRadius: "105%"
            }
            ,{
                from: 0, to: 4000, color: "#68f442", innerRadius: "100%", outerRadius: "105%"
            }
            ], pane:0, title: {
                text: '<br/><span style="font-size:8px">DTE</span>', y: -40
            }
        }
        ], series:[ {
            name: "remaining_power", data: [0], yAxis: 0
        }
        ]
    }
    ))
 ,
 $("#container-engine_rpm").highcharts(Highcharts.merge(e, {
        title: {
            text: "Engine RPM"
        }
        , yAxis:[ {
            min:0, max:19000, minorTickPosition:"outside", tickPosition:"outside", labels: {
                rotation: "auto", distance: 20
            }
            , plotBands:[ {
                from: 15000, to: 19000, color: "#C02316", innerRadius: "100%", outerRadius: "105%"
            }
            ,{
                from: 10000, to: 15000, color: "#fcfc49", innerRadius: "100%", outerRadius: "105%"
            }
            ,{
                from: 0, to: 10000, color: "#68f442", innerRadius: "100%", outerRadius: "105%"
            }
            ], pane:0, title: {
                text: '<br/><span style="font-size:8px">DTE</span>', y: -40
            }
        }
        ], series:[ {
            name: "engine rpm", data: [0], yAxis: 0
        }
        ]
    }
    ))
}

);

var COGNITO_IDENTITY_POOL="us-east-1:myidentitypool",
REGION="us-east-1",
IOTENDPOINT="myiotendpoint.iot.us-east-1.amazonaws.com",
$_GET= {}

;
document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function() {
    function e(e) {
        return decodeURIComponent(e.split("+").join(" "))
    }
    $_GET[e(arguments[1])]=e(arguments[2])
}

);
var avawsid=null===$_GET.id||void 0===$_GET.id?"AVAWS01":$_GET.id,
TOPIC="/topics/DonkeyCars/" + avawsid;

console.log("Topic "+TOPIC),
$("#avawsid").html(avawsid),

AWS.config.region=REGION;
var credentials=new AWS.CognitoIdentityCredentials( {
    IdentityPoolId: COGNITO_IDENTITY_POOL
}

);
AWS.config.credentials=credentials,
credentials.get(function(e) {
    if(e)return void console.log(e);
    var o=SigV4Utils.getSignedUrl("wss", IOTENDPOINT, "/mqtt", "iotdevicegateway", REGION, credentials.accessKeyId, credentials.secretAccessKey, credentials.sessionToken);
    console.log(o),
    initClient(o)
}

),
$(document).ready(function() {
    $(".dropdown-toggle").dropdown()
}

);