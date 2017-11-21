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
        update($("#container-speed").highcharts(), parseInt(o.speed)),
        update($("#container-rpm").highcharts(), parseInt(o.rpm/1e3)),
        update($("#container-co").highcharts(), parseInt(o.co)),
        update($("#container-temp").highcharts(), parseInt(o.temp))
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
    colors:["#2b908f",
    "#90ee7e",
    "#f45b5b",
    "#7798BF",
    "#aaeeee",
    "#ff0066",
    "#eeaaee",
    "#55BF3B",
    "#DF5353",
    "#7798BF",
    "#aaeeee"],
    chart: {
        backgroundColor: {}
        ,
        style: {
            fontFamily: "'Unica One', sans-serif"
        }
        ,
        plotBorderColor:"#606063"
    }
    ,
    title: {
        style: {
            color: "#FFF", textTransform: "uppercase", fontSize: "20px"
        }
    }
    ,
    subtitle: {
        style: {
            color: "#FFF", textTransform: "uppercase"
        }
    }
    ,
    xAxis: {
        gridLineColor:"#707073",
        labels: {
            style: {
                color: "#E0E0E3"
            }
        }
        ,
        lineColor:"#707073",
        minorGridLineColor:"#505053",
        tickColor:"#707073",
        title: {
            style: {
                color: "#A0A0A3"
            }
        }
    }
    ,
    yAxis: {
        gridLineColor:"#707073",
        labels: {
            style: {
                color: "#E0E0E3"
            }
        }
        ,
        lineColor:"#707073",
        minorGridLineColor:"#505053",
        tickColor:"#707073",
        tickWidth:1,
        title: {
            style: {
                color: "#A0A0A3"
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
                color: "#B0B0B3"
            }
            ,
            marker: {
                lineColor: "#333"
            }
        }
        ,
        boxplot: {
            fillColor: "#505053"
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
            color: "#E0E0E3"
        }
        ,
        itemHoverStyle: {
            color: "#FFF"
        }
        ,
        itemHiddenStyle: {
            color: "#606063"
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
            color: "#707073"
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
                fill: "#505053"
            }
        }
    }
    ,
    rangeSelector: {
        buttonTheme: {
            fill:"#505053",
            stroke:"#000000",
            style: {
                color: "#CCC"
            }
            ,
            states: {
                hover: {
                    fill:"#707073",
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
            backgroundColor: "#333", color: "silver"
        }
        ,
        labelStyle: {
            color: "silver"
        }
    }
    ,
    navigator: {
        handles: {
            backgroundColor: "#666", borderColor: "#AAA"
        }
        ,
        outlineColor:"#CCC",
        maskFill:"rgba(255,255,255,0.1)",
        series: {
            color: "#7798BF", lineColor: "#A6C7ED"
        }
        ,
        xAxis: {
            gridLineColor: "#505053"
        }
    }
    ,
    scrollbar: {
        barBackgroundColor: "#808083", barBorderColor: "#808083", buttonArrowColor: "#CCC", buttonBackgroundColor: "#606063", buttonBorderColor: "#606063", rifleColor: "#FFF", trackBackgroundColor: "#404043", trackBorderColor: "#404043"
    }
    ,
    legendBackgroundColor:"rgba(0, 0, 0, 0.5)",
    background2:"#FFF",
    dataLabelsColor:"#B0B0B3",
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
            center:["50%", "85%"], size:"140%", startAngle:-90, endAngle:90, background: {
                backgroundColor: "#666", innerRadius: "60%", outerRadius: "100%", shape: "arc"
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
    , o= {
        chart: {
            type:"gauge", plotBorderWidth:3, plotBackgroundColor: {
                linearGradient: {
                    x1: 0, y1: 0, x2: 0, y2: 1
                }
                , stops:[[0, "#ccc"], [.3, "#efefef"], [1, "#ccc"]]
            }
            , plotBackgroundImage:null, height:200
        }
        , pane:[ {
            startAngle: -45, endAngle: 45, background: null, center: ["52%", "145%"], size: 300
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
    $("#container-speed").highcharts(Highcharts.merge(e, {
        yAxis: {
            min:0, max:160, title: {
                text: "Speed"
            }
        }
        , credits: {
            enabled: !1
        }
        , series:[ {
            name:"Speed", data:[0], dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:'+(Highcharts.theme&&Highcharts.theme.contrastTextColor||"black")+'">{y}</span><br/><span style="font-size:12px;color:silver">miles/h</span></div>'
            }
            , tooltip: {
                valueSuffix: " miles/h"
            }
        }
        ]
    }
    )), $("#container-rpm").highcharts(Highcharts.merge(e, {
        yAxis: {
            min:0, max:5, title: {
                text: "RPM"
            }
        }
        , series:[ {
            name:"RPM", data:[0], dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:'+(Highcharts.theme&&Highcharts.theme.contrastTextColor||"black")+'">{y:.1f}</span><br/><span style="font-size:12px;color:silver">* 1000 / min</span></div>'
            }
            , tooltip: {
                valueSuffix: " revolutions/min"
            }
        }
        ]
    }
    )), $("#container-co").highcharts(Highcharts.merge(o, {
        yAxis:[ {
            min:0, max:20, minorTickPosition:"outside", tickPosition:"outside", labels: {
                rotation: "auto", distance: 20
            }
            , plotBands:[ {
                from: 16, to: 20, color: "#C02316", innerRadius: "100%", outerRadius: "105%"
            }
            , {
                from: 0, to: 4, color: "#666", innerRadius: "100%", outerRadius: "105%"
            }
            ], pane:0, title: {
                text: 'CO<br/><span style="font-size:8px">Carbon Monoxide</span>', y: -40
            }
        }
        ], title: {
            text: "Gas Gauges"
        }
        , series:[ {
            name: "Carbon Monoxide", data: [0], yAxis: 0
        }
        ]
    }
    )), $("#container-temp").highcharts(Highcharts.merge(o, {
        title: {
            text: "Temperature"
        }
        , yAxis:[ {
            min:60, max:300, minorTickPosition:"outside", tickPosition:"outside", labels: {
                rotation: "auto", distance: 20
            }
            , plotBands:[ {
                from: 200, to: 300, color: "#C02316", innerRadius: "100%", outerRadius: "105%"
            }
            , {
                from: 60, to: 120, color: "#80b0fc", innerRadius: "100%", outerRadius: "105%"
            }
            ], pane:0, title: {
                text: '°F<br/><span style="font-size:8px">Fahrenheit</span>', y: -40
            }
        }
        ], series:[ {
            name: "Temperature", data: [0], yAxis: 0
        }
        ]
    }
    ))
}

);
var COGNITO_IDENTITY_POOL="us-west-2:50eefb59-a1df-4b39-9d43-08f90aa82c48",
REGION="us-west-2",
IOTENDPOINT="a3lb40kqugbmo1.iot.us-west-2.amazonaws.com",
MAPBOX_TOKEN="pk.eyJ1IjoiamVyd2FsbGFjZTIiLCJhIjoiY2MwNGNjYzNiNDcyMDliMmJiZWE1OTQxN2VmODZlYWYifQ.QlnlR1xuvILW8ED6QoEB_A",
$_GET= {}

;
document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function() {
    function e(e) {
        return decodeURIComponent(e.split("+").join(" "))
    }
    $_GET[e(arguments[1])]=e(arguments[2])
}

);
var osmcid=null===$_GET.id||void 0===$_GET.id?"osmc0001":$_GET.id,
TOPIC="osmc/"+osmcid;
console.log("Topic "+TOPIC),
$("#bikename").html(osmcid),
mapboxgl.accessToken=MAPBOX_TOKEN;
var map=new mapboxgl.Map( {
    container: "map", style: "mapbox://styles/mapbox/light-v9", center: [-115.08, 36.1], zoom: 12
}

);
map.addControl(new mapboxgl.GeolocateControl),
map.addControl(new mapboxgl.NavigationControl),
map.on("load", function() {
    map.addSource("points", {
        type:"geojson", data: {
            type:"FeatureCollection", features:[ {
                type:"Feature", geometry: {
                    type: "Point", coordinates: [-122.414, 37.776]
                }
                , properties: {
                    icon: "bicycle-share"
                }
            }
            ]
        }
    }
    ), map.addLayer( {
        id:"points", type:"symbol", source:"points", layout: {
            "icon-image":"{icon}-15", "text-field":"{title}", "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"], "text-offset": [0, .6], "text-anchor": "top"
        }
    }
    )
}

),
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