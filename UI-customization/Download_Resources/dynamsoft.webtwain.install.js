/*! 20240828181423453
* Dynamsoft JavaScript Library
* Product: Dynamic Web TWAIN
* Web Site: https://www.dynamsoft.com
*
* Copyright 2024, Dynamsoft Corporation
* Author: Dynamsoft Support Team
* Version: 18.5.1
*/

//Dynamsoft.On{actionName} It is a callback function called by Web-TWAIN product. The contents of this function are the default templates of the WebTWAIN. Users can modify the fucntions, but be aware that the function name itself cannot be modified
//Dynamsoft._{functionName} It is a private function used by Dynamsoft.On{actionName}. Users can modify and delete according to their needs.
(function () {
  "use strict";
  var promptDlgWidth = 620,
  imagesInBase64 = {
    icn_download: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAgCAYAAAAMq2gFAAABOklEQVRIie2WTW6DMBCFH4h1l22VqmqPVUEvEJa9gRt6FDhDpfx0FdJj+Arx3nldhEjEdchgWlaM9CSwMZ/fzMgQvX0TwvA+ePOpIsniRIwZGIl/n/8AGs3RWKB4JA4STjUKBo1EivLtGakEkP7Ru6vbpcpONzFxPFsazQloZyxEmkDepsYk0JIhkZGwzngfWRKvd0u1Pwf93k1NoBjg5uN+pbZuHn0gEFgQ2AVAdgTefQVzU9e2nzaplKbMkEhnK2W9oAOAC9IHIO+Yd5U/rJX2QbocnVSSqARuqse1Ki9BumrUp+U1gXkXRAoyBDIC1jNnCWRPG2Wug2SFrkkUnvHieaPqaxCpo3bL104rLySQviDbpNA0Sgl4W9kXfU9vjWPho+ZaHCHfo6r/kumfYUBEL1/jeJpqFBw/d5aBU2kHOMQAAAAASUVORK5CYII=',
    icn_install: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAA+klEQVRIid2SMWoCQRiFv3GnW7BII6ZPqeAlorewtBELsZdFOz2Q0VYkXQ6QA9iaIqU+mx2Y3QRd12WKffCY4WdmPt5jzPRT5PQOfOSHnky6/rnoqd/cJFt/0FB6I3UkWOVmZbz+GcyjLEjgeSjRzc3KuCMxzIC8fQwsbtTxqJan/jz+r7qZ4LWC2pzbgpkDmclBAG3gO011T0U+g9Mv8PayTY4u0UIQV5jGORYsAcz4oA7wBWR+SUWJAM5Az17E6gFIGUXA2goGJR8wAK1dUuiwVdECnpQZ7cOggiWy5zCcgIkCcbCX2iUKB6pfdfVLFAwUiNS4f6QaXQHE5K75dPBEiQAAAABJRU5ErkJggg==',
    icn_scan: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAADI0lEQVRIibWXTUhUURTHf+/NsxRCp3QGwhKT/MDoAyNo1apmNhYkodGmaFOWmUXQcpgo2gRN5kerllEGLWqjBqZGFH2BlSRJRVqCjpNjYOaUc1q80fnovZmnMx34w+Odc+///u+9595zlbPPBAuWBbiBPcAOoASwR3xB4BPwAngIdOV2en+n6lA5k5zYDjQBJwCHlRECk0Ar4Mvr9AbNglQRMMFBEYZE8IjgSBKXiIJIm6Gg23PQVHHT038U24DrQL1FhamsHThl7/LOxysGYmAT6BCoT/ifDuoFOqbcHlsyYp9ATQZJF1AjcC2OOMZbh9CQacYYnPzu8tQlKrYLNP8/zkU0B1weeyxxk4AzkySqYvjfKXp6opx8IiuAr1jP05S2bQ3sL4a29zA++4/bD6xTBVwCjkwp3eGAo+WQnw1b8w1jHAIuTQRXppTuWgt1JaAA90egc9Q01K0JVGWCdHch1BTr33c/Q89Y0vAqLQxl6ZJWF8He9RAWuPURHo+nbFKqiZC3XEIFOLAB9hTqpDc/wHO/paZ5ahgwQtEqOFIGNtXYD3Boo076R+DGe3jmN441gibCNAmplKXA8QooyAb7CmgZhLlw1G9T4GgZ7HRCKAytg/DO9AI0tGlVYDhxy4cEmgdhOgSVdjizGXI03acpcKxCJ/01D1ffwdvgktNuWBV4ZeQc/QmX30BgDkpz4dxmWL0SGjbB9gKY+QNX3sLQ9LLy/bVyuE+qgQdmc5K/Es5vAWcO/A5Dlgo/QjrpyMySpjfW9qkC3QIBs9FNzsGlARj7qZNOzcHlAfgys+zTzS/QpYq+pC3JgqdCOvnLSbg4AN9m0zpW20oeeUMLNZdPhIlktdSPEFwbhIlZ8xgL8Ivgg+i1GBRoTEOFVTRu7NUrz9gq844IrWmoSYXW0l7v7YXdpUn8bjsNrAVqLO9Pa3Yv0veiJRZ78wK1Au0ZnN52gdryvvjyVjMY3Tz6y6EfvTJ0LlPlBHC6oi86vfGKzdfktgjlIlwQIbCEtQxE2pSbkQIotT1i5ou1hUebi+ijbXXEN0X00dYNdFf2e0OpOvwLFunYK2i9bNwAAAAASUVORK5CYII='
  };

  if(Dynamsoft.navInfoSync.bMobile) {
    if(screen.width<620) {
      promptDlgWidth = screen.width - 10;
    }
  }

  //----------------------start Install Dialog---------------------------

  //Web TWAIN Service is not detected dialogs
  //Windows
  Dynamsoft.OnWebTwainNotFoundOnWindowsCallback = function (ProductName, InstallerUrl, bHTML5, bIE, bSafari, bSSL, strIEVersion) {
    var _this = Dynamsoft,
      objUrl = {
        'default': 'https://demo.dynamsoft.com/DWT/Resources/dist/DynamsoftServiceSetup.msi'
      };
    _this._show_install_dialog(ProductName, objUrl, bHTML5, Dynamsoft.DWT.EnumDWT_PlatformType.enumWindow, bIE, bSafari, bSSL, strIEVersion, false);
  };

  //Linux
  Dynamsoft.OnWebTwainNotFoundOnLinuxCallback = function (ProductName, strDebUrl, strRpmUrl, bHTML5, bIE, bSafari, bSSL, strIEVersion, iPlatform) {
    var _this = Dynamsoft,
      objUrl = {
        'default': 'https://demo.dynamsoft.com/DWT/Resources/dist/DynamsoftServiceSetup.deb',
        'deb': 'https://demo.dynamsoft.com/DWT/Resources/dist/DynamsoftServiceSetup.deb',
        'rpm': 'https://demo.dynamsoft.com/DWT/Resources/dist/DynamsoftServiceSetup.rpm'
      };
    if (!iPlatform) iPlatform = Dynamsoft.DWT.EnumDWT_PlatformType.enumLinux;
    _this._show_install_dialog(ProductName, objUrl, bHTML5, iPlatform, bIE, bSafari, bSSL, strIEVersion, false);
  };

  //MacOS
  Dynamsoft.OnWebTwainNotFoundOnMacCallback = function (ProductName, InstallerUrl, bHTML5, bIE, bSafari, bSSL, strIEVersion) {
    var _this = Dynamsoft,
      objUrl = {
        'default': 'https://demo.dynamsoft.com/DWT/Resources/dist/DynamsoftServiceSetup.pkg'
      };
    _this._show_install_dialog(ProductName, objUrl, bHTML5, Dynamsoft.DWT.EnumDWT_PlatformType.enumMac, bIE, bSafari, bSSL, strIEVersion, false);
  };

  //Android
  Dynamsoft.OnWebTwainNotFoundOnAndroidCallback = function (ProductName, InstallerUrl, bSSL, bUpgrade) {
    var objUrl = {
      'default': 'https://demo.dynamsoft.com/DWT/Resources/dist/DynamsoftServiceSetup.apk'
    }, dt = Math.random();

    var _path = Dynamsoft.DWT.ServiceInstallerLocation;
    if (Dynamsoft.Lib.isString(_path) && _path.length > 0) {
      var sep = '';

      if (_path[_path.length - 1] != '/') {
        sep = '/';
      }

      objUrl.default = [_path, sep, 'DynamsoftServiceSetup.apk'].join('');
    }

    objUrl.openService = "intent://dynamsoft.com/#Intent;scheme=http;package=com.dynamsoft.mobilescan;S.timestamp=" + dt + ";end";
    Dynamsoft.DWT.Host = 'local.dynamsoft.com';
    Dynamsoft._show_android_install_dialog(objUrl, bUpgrade);
  };

  //Web TWAIN Service is not supported dialogs
  //Mobile Browsers
  Dynamsoft.OnMobileNotSupportCallback = function () {
    var ObjString = [];

    if (Dynamsoft.DWT) {

      ObjString.push('<div class="ds-dwt-ui-dlg-android" style="padding-bottom:30px">');
      ObjString.push('Service Mode does not support your Operating System, please contact the site administrator.');
      ObjString.push('</div>');

      Dynamsoft.DWT.ShowMessage(ObjString.join(''), {
        width: 335,
        headerStyle: 1,
        backgroundStyle: 1
      });
    } else {
      console.log("The Dynamsoft namespace is missing");
    }

  };

  //Error Message - HTTPS is required to allow CORS to function. This error appears when HTTP is detected. (See: https://www.dynamsoft.com/web-twain/docs/faq/http-insecure-websites-in-chromium-browser.html?ver=latest)
  Dynamsoft.OnHTTPCorsError = function (msg) {

    var ObjString = [
      "<div>", msg, "</div>",
      '<div style="margin-top:10px">To fix the issue, please update your website to HTTPS or refer to <br /><a target="_blank" href="https://www.dynamsoft.com/web-twain/docs/faq/http-insecure-websites-in-chromium-browser.html?ver=latest">this article</a> for other workarounds.</div>'
    ].join('');

    Dynamsoft.DWT.ShowMessage(ObjString, {
      width: promptDlgWidth,
      headerStyle: 2
    });
  };

  Dynamsoft._show_install_dialog = function (ProductName, objInstallerUrl, bHTML5, iPlatform, bIE, bSafari, bSSL, strIEVersion, bNeedUpgrade) {

    var _this = Dynamsoft,
      ObjString, title, browserActionNeeded,
      EnumPlatform = Dynamsoft.DWT.EnumDWT_PlatformType,
      bUnix = (iPlatform == EnumPlatform.enumLinux || iPlatform == EnumPlatform.enumEmbed || iPlatform == EnumPlatform.enumChromeOS || iPlatform == EnumPlatform.enumHarmonyOS);

    if (Dynamsoft.DWT.bNpm && Dynamsoft.navInfoSync.bFileSystem) {
      return Dynamsoft._show_online_download_dialog(objInstallerUrl, bHTML5, iPlatform);
    }

    if (_this.DWT) {
      if (bHTML5 && iPlatform == Dynamsoft.DWT.EnumDWT_PlatformType.enumWindow && !bIE) {
        if (bNeedUpgrade)
          title = 'Please follow the steps below to upgrade your local document scanning service.';
        else
          title = 'Please complete one-time setup to work with your physical doc scanner(s).';

        ObjString = ['<div class="dynamsoft-dialog dynamsoft-dialog2">',
          '<div class="dynamsoft-dwt-dlg-close" onclick="Dynamsoft._dwt_stop_Reconnect();">X</div>',
          '<div class="dynamsoft-dwt-dlg-title">',title,'</div>',
          '<div class="dwt-dlg-StepInfo">',
          '<div class="dwt-dlg-Step">Step1</div>',
          '<div class="dwt-dlg-StepDetail1">Get service installer',
          '<a target="_blank" href="',
          objInstallerUrl['default'],
          '"><span class="dynamsoft-dwt-dlg-button">Download</span></a></div>',
          '</div>',
          '<div class="dwt-dlg-StepInfo">',
            '<div class="dwt-dlg-Step">Step2</div>',
            '<div class="dwt-dlg-StepDetail2">After installation, please wait a few seconds for the service to <div>connect.</div><div id="connecting">[Waiting for connection...]</div>',
          '</div>',
          '</div>',
          '</div>'
        ];

        Dynamsoft.DWT.ShowMessage(ObjString.join(''), {
          width: 800,
          headerStyle: 1,
          closeButton: false
        });

        reconnectTime = new Date();
        stop_reconnect = false;
        setTimeout(Dynamsoft._dwt_Reconnect, 100);
        return;
      }
    }

    if (bNeedUpgrade)
      title = 'Please update your document scanning service'; //'Please follow the steps below to upgrade your local document scanning service.';
    else
      title = 'Please complete one-time setup';
    ObjString = [
      '<div class="dynamsoft-dwt-dlg-title">',
      title,
      '</div>'
    ];

    if (_this.DWT) {

      var bFirefox = Dynamsoft.navInfoSync.bFirefox;
      if (bUnix || bFirefox) {
        browserActionNeeded = 'RESTART';
      } else {
        browserActionNeeded = 'REFRESH';
      }
      ObjString.push('<div class="dynamsoft-dwt-installdlg-iconholder"> ');
      ObjString.push('<div class="dynamsoft-dwt-installdlg-splitline" style="left: 125px"></div>');
      ObjString.push('<div class="dynamsoft-dwt-installdlg-splitline" style="left: 283px"></div>');
      ObjString.push('<img style="margin: 0px 134px 0px 0px" src=' + imagesInBase64.icn_download + ' alt="download">');
      ObjString.push('<img style="margin: 2px 132px 2px 0px" src=' + imagesInBase64.icn_install + ' alt="install">');
      ObjString.push('<img src=' + imagesInBase64.icn_scan + ' alt="scan">');
      ObjString.push('<div><span class="dynamsoft-dwt-installdlg-text" style="right: 125px">Download</span>');
      ObjString.push('<span class="dynamsoft-dwt-installdlg-text" style="right: 18px">Install</span>');
      ObjString.push('<span class="dynamsoft-dwt-installdlg-text" style="left: 105px">Scan</span>');
      ObjString.push('</div>');
      ObjString.push('</div>');

      if (bHTML5 && bUnix) {
        ObjString.push('<div style="margin:10px 0 0 60px;">');
        ObjString.push('<div id="dwt-install-url-div">');

        var arm64 = Dynamsoft.navInfo.bArm64,
          mips64 = Dynamsoft.navInfo.bMips64,
          chromeOS = Dynamsoft.navInfoSync.bChromeOS,
          harmonyOS = Dynamsoft.navInfoSync.bHarmonyOS;

        if (arm64 || mips64 || chromeOS || harmonyOS) {} else {
          ObjString.push('<div><input id="dwt-install-url-deb" name="dwt-install-url" type="radio" onclick="Dynamsoft.dwt_change_install_url(\'' + objInstallerUrl.deb + '\')" checked="checked" /><label for="dwt-install-url-deb">64 bit .deb (For Ubuntu/Debian)</label></div>');
          ObjString.push('<div><input id="dwt-install-url-rpm" name="dwt-install-url" type="radio" onclick="Dynamsoft.dwt_change_install_url(\'' + objInstallerUrl.rpm + '\')" /><label for="dwt-install-url-rpm">64 bit .rpm (For Fedora)</label></div>');
        }
        ObjString.push('</div></div>');
      }

      ObjString.push('<div><a id="dwt-btn-install" target="_blank" href="');
      ObjString.push(objInstallerUrl['default']);
      ObjString.push('"');
      if (bHTML5) {
        ObjString.push(' html5="1"');
      } else {
        ObjString.push(' html5="0"');
      }

      ObjString.push(' onclick="Dynamsoft.DCP_DWT_onclickInstallButton()"><div class="dynamsoft-dwt-dlg-button">Download</div></a></div>');
      if (bHTML5) {
        if (bIE) {
          ObjString.push('<div class="dynamsoft-dwt-dlg-tail" style="text-align:left; padding-left: 80px">');
          ObjString.push('If you still see the dialog after installing the scan service, please<br />');
          ObjString.push('1. Add the website to the zone of trusted sites.<br />');
          ObjString.push('IE | Tools | Internet Options | Security | Trusted Sites.<br />');
          ObjString.push('2. Refresh your browser.');
          ObjString.push('</div>');

        } else {

          if (bUnix) {
            ObjString.push('<div class="dynamsoft-dwt-dlg-tail">');
            ObjString.push('<div class="dynamsoft-dwt-dlg-red">After the installation, please <strong>' + browserActionNeeded + '</strong>  your browser.</div>');
            ObjString.push('</div>');
          }

        }

      } else {
        ObjString.push('<div class="dynamsoft-dwt-dlg-tail" style="text-align:left; padding-left: 80px">');
        if (bIE) {
          ObjString.push('After the installation, please<br />');
          ObjString.push('1. Restart the browser<br />');
          ObjString.push('2. Allow "DynamicWebTWAIN" add-on to run by right clicking on the Information Bar in the browser.');
        } else {
          ObjString.push('<div class="dynamsoft-dwt-dlg-red">After installation, please <strong>REFRESH</strong> your browser.</div>');
        }
        ObjString.push('</div>');
      }
      _this.DWT.ShowMessage(ObjString.join(''), {
        width: promptDlgWidth,
        headerStyle: 1
      });
    } else {
      console.log("The Dynamsoft namespace is missing");
    }
  };

  Dynamsoft._dwt_change_install_url = function (url) {
    var install = document.getElementById('dwt-btn-install');
    if (install)
      install.href = url;
  };

  var reconnectTime = 0;
  Dynamsoft._dcp_dwt_onclickDownloadButton = function() {
    var install = document.getElementById('dwt-install-url-div');
    if (install)
      install.style.display = 'none';

    var el = document.getElementById('dwt-btn-install');
    if (el) {
      if (el.getAttribute("html5") == "1") {
        var pel = el.parentNode,
        newDiv = document.createElement('div');
        newDiv.id = 'dwt-btn-install';
        newDiv.style.textAlign = "center";
        newDiv.style.paddingBottom = '15px';
        newDiv.style.fontSize = '14px';
        newDiv.innerHTML = 'Please proceed with the installation. Once done, <a href="javascript:void(0)" onclick="Dynamsoft._dcp_dwt_onclickInstallButton()">click here to verify completion.</a>';
        newDiv.setAttribute("html5", "1");
        pel.removeChild(el);
        pel.appendChild(newDiv);
      } else {
        var pel = el.parentNode;
        pel.removeChild(el);
      }
    }
    return true;
  };
  Dynamsoft._dcp_dwt_onclickInstallButton = function () {
    var install = document.getElementById('dwt-install-url-div');
    if (install)
      install.style.display = 'none';

    var divTitle = Dynamsoft.Lib.one('.dynamsoft-dwt-dlg-title');
    if (divTitle) {
      divTitle.style('display','');
    }
    var divTitleErr = Dynamsoft.Lib.one('.dynamsoft-dwt-dlg-title-error');
    if (divTitleErr) {
      divTitleErr.style('display','none');
    }

    var el = document.getElementById('dwt-btn-install');
    if (el) {
      setTimeout(function () {
        if (el.getAttribute("html5") == "1") {
          var pel = el.parentNode,
            newDiv = document.createElement('div');
          newDiv.id = 'dwt-btn-install';
          newDiv.style.textAlign = "center";
          newDiv.style.paddingBottom = '15px';
          newDiv.style.fontSize = '14px';
          
          newDiv.innerHTML = 'Connecting to the service...';
          newDiv.setAttribute("html5", "1");
          pel.removeChild(el);
          pel.appendChild(newDiv);
          reconnectTime = new Date();
          stop_reconnect = false;
          setTimeout(Dynamsoft._dwt_Reconnect, 10);
        } else {
          var pel = el.parentNode;
          pel.removeChild(el);
        }
      }, 10);
    }
    return true;
  };

  var stop_reconnect = false;
  
  Dynamsoft._dwt_stop_Reconnect = function () {
    stop_reconnect = true;
    Dynamsoft.DWT.CloseDialog();
  }

  Dynamsoft._dwt_Reconnect = function () {
    var _this = Dynamsoft;
    if (((new Date() - reconnectTime) / 1000) > 300) {
      // change prompt
      var divTitleErr = Dynamsoft.Lib.one('#connecting');
      if (divTitleErr) {
        divTitleErr.html('Failed to connect to the service!');
      }
      return;
    }
    if (_this.DWT) {

      var _timeSpan = 500;
      if (navigator.userAgent.indexOf("Safari") > -1) {
        _timeSpan = 2000;
      }

      _this.DWT.CheckConnectToTheService(function () {
        Dynamsoft.DWT.CloseDialog();
        Dynamsoft.DWT.ConnectToTheService();
      }, function () {
        if (Dynamsoft.DWT.NeedCheckWebTwainBySocket()) {
          Dynamsoft.DWT.CheckWebTwainBySocket(function () {
            Dynamsoft.OnHTTPCorsError();
          }, function () {
            if(!stop_reconnect)
              setTimeout(Dynamsoft._dwt_Reconnect, _timeSpan);
          }, function () {
            if(!stop_reconnect)
              setTimeout(Dynamsoft._dwt_Reconnect, _timeSpan);
          });
          return;
        }
        if(!stop_reconnect)
          setTimeout(Dynamsoft._dwt_Reconnect, _timeSpan);
      });
    } else {
      console.log("The Dynamsoft namespace is missing");
    }
  };

  Dynamsoft._show_android_install_dialog = function (objInstallerUrl, bUpgrade) {
    var ObjString;

    if (Dynamsoft.DWT.bNpm && Dynamsoft.navInfoSync.bFileSystem) {
      return Dynamsoft._show_online_download_dialog(objInstallerUrl, bHTML5, iPlatform);
    }

    ObjString = [];

    if (Dynamsoft.DWT) {

      ObjString.push('<div class="ds-dwt-ui-dlg-android">');

      ObjString.push('<div>Please download and ');

      if(bUpgrade) {
        ObjString.push('update');
      } else {
        ObjString.push('install');
      }

      ObjString.push(' the <strong>DYNAMSOFT SERVICE</strong> app via the </div>');

      ObjString.push('<div><a target="_blank" href="');
      ObjString.push(objInstallerUrl['default']);
      ObjString.push('" onclick="Dynamsoft._dwt_ReconnectForAndroid()">direct APK download link</a>.</div>');
      ObjString.push('</div>');

      ObjString.push('<div class="dynamsoft-dwt-dlg-tail" style="text-align:left">');
      ObjString.push('If you have ');
      
      if(bUpgrade) {
        ObjString.push('updated');
      } else {
        ObjString.push('installed');
      }
      
      ObjString.push(' it, please click on the button below to initiate the connection.');

      ObjString.push('<a target="_blank" href="');
      ObjString.push(objInstallerUrl.openService);
      ObjString.push('" onclick="Dynamsoft._dwt_ReconnectForAndroid()"><div class="dynamsoft-dwt-dlg-button-android">Open Service</div></a>');

      ObjString.push('</div>');

      ObjString.push('</div>');

      Dynamsoft.DWT.ShowMessage(ObjString.join(''), {
        width: 335,
        headerStyle: 1,
        backgroundStyle: 1
      });
    } else {
      console.log("The Dynamsoft namespace is missing");
    }

    if (Dynamsoft.DWT && Dynamsoft.DWT.OnWebTwainNotFound) {
      Dynamsoft.DWT.OnWebTwainNotFound();
    }
  };

  Dynamsoft._dwt_ReconnectForAndroid = function () {
    Dynamsoft.DWT.CheckConnectToTheService(function (bConnected) {
      if (bConnected) {
        Dynamsoft.DWT.CloseDialog();
        Dynamsoft.DWT.ConnectToTheService();
      } else {
        setTimeout(Dynamsoft._dwt_ReconnectForAndroid, 500);
      }

    }, function () {
      setTimeout(Dynamsoft._dwt_ReconnectForAndroid, 500);
    });
  }

  //Dynamsoft.OnWebTwainNotFoundOnAndroidCallback = Dynamsoft.MobileNotSupportCallback;
  //------------------------end Install Dilaog---------------------------


  //----------------------start Upgrade Dialog---------------------------

  Dynamsoft.OnWebTwainNeedUpgradeCallback = function (ProductName, objInstallerUrl, bHTML5, iPlatform, bIE, bSafari, bSSL, strIEVersion) {
    Dynamsoft._show_install_dialog(ProductName, objInstallerUrl, bHTML5, iPlatform, bIE, bSafari, bSSL, strIEVersion, true, true);
  };

  Dynamsoft.OnWebTwainNeedUpgradeOnAndroidCallback = function (ProductName, InstallerUrl, bSSL) {
    Dynamsoft.OnWebTwainNotFoundOnAndroidCallback(ProductName, InstallerUrl, bSSL, true);
  };

  //----------------------end Upgrade Dialog---------------------------

  //----------------------start DLS License -----------------------
  Dynamsoft.OnLTSLicenseError = function (message, code) {

    var addMessage = '',
      ObjString;

    if (code == -2440 || // NetworkError
      code == -2441 || // Timedout
      code == -2443 || // CorsError
      code == -2446 || // LtsJsLoadError
      message.indexOf('Internet connection') > -1 ||
      message.indexOf('Storage') > -1) {

      var purchaseUrl = 'https://www.dynamsoft.com/customer/license/trialLicense?product=dwt&deploymenttype=js';
      addMessage = '<div>You can register for a free 30-day trial <a href="' + purchaseUrl + '" target="_blank" class="dynamsoft-major-color">here</a>. Make sure to select the product Dynamic Web TWAIN.</div>';
    }

    ObjString = [
      message,
      addMessage
    ];

    Dynamsoft.DWT.ShowMessage(ObjString.join(''), {
      width: promptDlgWidth,
      headerStyle: 2
    });
  };

  Dynamsoft.OnLTSConnectionWarning = function () {

    var ObjString = [
      'Warning: You are seeing this dialog because Dynamic Web TWAIN has failed to connect to the License Tracking Server. ',
      'A cached authorization is being used, and you can continue to use the software as usual. ',
      'Please get connected to the network as soon as possible. ',
      Dynamsoft.DWT.isPublicLicense() ? '<a class="dynamsoft-major-color" href="https://www.dynamsoft.com/company/contact/">Contact Dynamsoft</a> ' : 'Contact the site administrator ',
      'for more information.'
    ].join('');

    Dynamsoft.DWT.ShowMessage(ObjString, {
      width: promptDlgWidth,
      caption: 'Warning',
      headerStyle: 2
    });
  };

  Dynamsoft.OnLTSPublicLicenseWarning = function (message) {

    Dynamsoft.DWT.ShowMessage(message, {
      width: promptDlgWidth,
      caption: 'Warning',
      headerStyle: 2
    });
  };

  //--------------------end DLS License-------------------------------

  //----------------------start Product Key -----------------------
  Dynamsoft.OnLicenseExpiredWarning = function (strExpiredDate, remain, trial) {

    var ObjString, strCaption,
      a_online_store = '<a target="_blank" href="https://www.dynamsoft.com/store/dynamic-web-twain/#DynamicWebTWAIN">online store</a>',
      a_new_key_href = 'https://www.dynamsoft.com/customer/license/trialLicense?product=dwt&utm_source=in-product';

    if (remain > 5 || !trial) {

    } else {

      if (remain > 0) { // 1~5

        var strDays;

        if (remain <= 1) {
          strDays = '1 day';
        } else {
          strDays = parseInt(remain) + ' days';
        }

        strCaption = 'Warning';
        ObjString = [
          '<div style="padding:0 0 10px 0">Kindly note your trial key is expiring in ', strDays, '. Two quick steps to extend your trial:</div>',
          '<div style="margin:0 0 0 10px">1. <a target="_blank" href="', a_new_key_href, '">Request a new trial key</a> and follow the instructions to set the new key</div>',
          '<div style="margin:0 0 0 10px">2. Refresh your scan page and try again</div>',
          '<div style="padding:0">If you are ready to purchase a full license, please go to the ', a_online_store, '.</div>'
        ].join('');

      } else {
        
        // Trial remain<=0 Expired
        ObjString = [
          '<div style="padding:0">Sorry. Your product key has expired on ', strExpiredDate, '. You can purchase a full license at the ', a_online_store, '.</div>',
          '<div style="padding:0">Or, you can try requesting a new product key at <a target="_blank" href="', a_new_key_href, '">this page</a>.</div>'
        ].join('');

      }
      
      if (ObjString) {
        Dynamsoft.DWT.ShowMessage(ObjString, {
          width: promptDlgWidth,
          caption: strCaption,
          headerStyle: 2
        });
      }
    } 

  };

  Dynamsoft.OnLicenseError = Dynamsoft.OnLicenseError || function (message, errorCode) {

    Dynamsoft.DWT.ShowMessage(Dynamsoft.ProcessLicenseErrorContent(message), {
      width: promptDlgWidth,
      headerStyle: 2
    });

  };
  
  Dynamsoft.OnCorsConfigError = function (msg) {

    var ObjString = [
      msg, " Please contact the Administrator to configure 'Access-Control-Allow-Origin'.",
    ].join('');

    Dynamsoft.DWT.ShowMessage(ObjString, {
      width: promptDlgWidth,
      headerStyle: 2
    });
  };

  Dynamsoft.ProcessLicenseErrorContent = function (content) {
    var el = [],
      _content = content;
    if (typeof(_content) != 'string') {
      if (undefined === _content)
        return '';
      if (_content instanceof Error || 'message' in _content)
        _content = _content.message;
      else
        _content = '' + _content;
    }

    var posLeftBracket = _content.indexOf("[");
    var posRightBracket = _content.indexOf("]", posLeftBracket);
    var posLeftParentheses = _content.indexOf("(", posRightBracket);
    var posRightParentheses = _content.indexOf(")", posLeftParentheses);
    if (-1 == posLeftBracket || -1 == posRightBracket || -1 == posLeftParentheses || -1 == posRightParentheses) {
      return _content;
    }

    if (posLeftBracket > 0) {
      el.push(_content.substring(0, posLeftBracket));
    }

    var linkText = _content.substring(posLeftBracket + 1, posRightBracket);
    var linkAddr = _content.substring(posLeftParentheses + 1, posRightParentheses);

    el.push(['<a href="', linkAddr, '" target="_blank" class="dynamsoft-major-color">', linkText, '</a>'].join(''));
    el.push(_content.substring(posRightParentheses + 1));

    return el.join('');
  }
  //--------------------end Product Key-------------------------------


})();