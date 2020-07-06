(function(){
  let iconCoordinate=[
    {
      TotemName:'Totem1',
      coordinate:'0px 0px',
    },
    {
      TotemName:'Totem2',
      coordinate:'0px 5%'
    },
    {
      TotemName:'Totem3',
      coordinate:'0px 10%'
    },
    {
      TotemName:'Totem4',
      coordinate:'0px 15.5%'
    },
    {
      TotemName:'Totem5',
      coordinate:'0px 20.7%'
    },
    {
      TotemName:'Totem6',
      coordinate:'0px 26%'
    },
    {
      TotemName:'Totem7',
      coordinate:'0px 31%'
    },
    {
      TotemName:'Totem8',
      coordinate:'0px 37%'
    },
    {
      TotemName:'Totem9',
      coordinate:'0px 42.1%'
    },
    {
      TotemName:'Totem10',
      coordinate:'0px 47.5%'
    },
    {
      TotemName:'Totem11',
      coordinate:'0px 53%'
    },
    {
      TotemName:'Totem12',
      coordinate:'0px 58%'
    },
    {
      TotemName:'Totem13',
      coordinate:'0px 63%'
    },
    {
      TotemName:'Totem14',
      coordinate:'0px 68.6%'
    },
    {
      TotemName:'Totem15',
      coordinate:'0px 74%'
    },
    {
      TotemName:'Totem16',
      coordinate:'0px 79.1%'
    },
    {
      TotemName:'Totem17',
      coordinate:'0px 84%'
    },
    {
      TotemName:'Totem18',
      coordinate:'0% 89.5%'
    },
    {
      TotemName:'Totem19',
      coordinate:'0% 95%'
    },
    {
      TotemName:'Totem20',
      coordinate:'0% 100%'
    }
  ]

  function init(){
    //v-for='(v,index) obj.coordinate in iconCoordinate'
    let $url = "url('xyzCommonFrame/mxplug/spiritIcons/img/userImg.png') no-repeat";
    $.each(iconCoordinate,function(i,obj){
       $('.infoImgMore').append('<li><span style="background: '+$url+';background-position: '+obj.coordinate+';background-size:cover;"></span></li>');
       //  $('.infoImgMore').append('<li><span style="background: '+$url+(i*-56)+'px'+'"></span></li>');

    })
  }
  window.spiritIcon = {
    init:init
  }
}())