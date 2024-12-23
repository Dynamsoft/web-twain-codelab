var globalRuntime = {},
m_pCapSettings = {};

function ListSupportedCaps(bCheckForChange, bInitialize) {
    var i, j, nCount = 0,
    sCapName = "",
    CapSupportedCaps, pCapSettingsTemp;
    $('#tBodyCAPList').html("");
    if(!bInitialize){
        pCapSettingsTemp = m_pCapSettings;
    }
    if(!bCheckForChange) {
        m_pCapSettings = {
            "SourceName": DWTObject.CurrentSourceName
        };
    }
    
    // get the supported capabilies
    DWTObject.getCapabilities(function(capabilityDetails){
        console.log(capabilityDetails);
        for(i = 0; i<capabilityDetails.length; i++){
            var capabilityDetail = capabilityDetails[i];
            
            var Item = {
                pszText: "",
                detailedText: "",
                CapID: -1, // The ID of the Capability
                byChanged: 0, // Each bit is used to indicate if that colume has changed.
                bReadOnly: true, // The Cap is only read only
                inquirable: false,
                OperationType: 0
            };
            
            Item.CapID = parseInt(capabilityDetail.capability.value);
            if(bCheckForChange){
                Item = m_pCapSettings["CAP_" + Item.CapID];
            }
            if(bInitialize){
                Item.CapDetail = capabilityDetail;
            } else {
                Item.CapDetail = pCapSettingsTemp["CAP_" + Item.CapID].CapDetail;
            }

            if (Item.CapID == CAP_SUPPORTEDCAPS) continue; //skip this capability
            Item.pszText = capabilityDetail.capability.label; //convertCAP_toString(Item.CapID);
            Item.detailedText = convertCAP_toDetailedString(Item.CapID);
            var _newTR = document.createElement('tr');
            _newTR.id = "CAP_" + Item.CapID;
            var _newTD = null;
            for (j = 0; j < 8; j++) {
                _newTD = document.createElement('td');
                switch (j) {
                    case 6:
                    case 7:
                        _newTD.innerText = i.toString();
                        _newTD.style.display = "none";
                        break;
                    case 0:
                        _newTD.style.fontSize = "x-small";
                        _newTD.style.padding = "0 5px";
                        _newTD.style.fontFamily = 'Consolas,"Liberation Mono",Menlo,Courier,monospace';
                        if (Item.detailedText != "")
                            _newTD.innerText = Item.detailedText + ' ' + Item.CapID;
                        else
                            _newTD.innerText = Item.pszText + ' ' + Item.CapID;
                        break;
                    case 1:
                        _newTD.style.textAlign = "center";
                        Item.CurrentValue = getCurrentValue(capabilityDetail);
                        Item.ArrayStringValues = getArrayStringValues(capabilityDetail);
                        Item.ActualValues = getActualValues(capabilityDetail);
                        Item.CurrentIndex = getCurrentIndex(capabilityDetail);
                        if (bInitialize)
                            Item.InitialValue = Item.CurrentValue;

                        if(Item.CurrentValue != undefined){
                            _newTD.innerText = Item.CurrentValue;
                        } else {
                            _newTD.innerText = "<<BADPROTOCOL>>";
                        }
                            
                        break;
                    case 2:
                        _newTD.style.textAlign = "center";
                        if(capabilityDetail.valueType != undefined){
                            _newTD.innerText = capabilityDetail.valueType.label + "(" + capabilityDetail.valueType.value + ")";
                        } else {
                            _newTD.innerText = "<<BADPROTOCOL>>";
                        }
                        break;
                    case 3:
                        _newTD.style.textAlign = "center";
                        if(capabilityDetail.conType != undefined) {
                            var sItemValue;
                            switch (capabilityDetail.conType.value) {
                                case TWON_ARRAY:
                                    sItemValue = "Array";
                                    break;

                                case TWON_ENUMERATION:
                                    sItemValue = "Enumeration";
                                    break;

                                case TWON_ONEVALUE:
                                    sItemValue = "One Value";
                                    break;

                                case TWON_RANGE:
                                    sItemValue = "Range";
                                    break;
                            }
                            _newTD.innerText = sItemValue;
                        } else {
                            _newTD.innerText = "<<BADPROTOCOL>>";
                        }
                        break;
                    case 4:
                        _newTD.style.textAlign = "center";
                        if(capabilityDetail.enums != undefined)
                            _newTD.innerText = capabilityDetail.enums.length;
                        else if(capabilityDetail.values != undefined)
                            _newTD.innerText = capabilityDetail.values.length;
                        break;
                    case 5:
                        _newTD.style.textAlign = "center";
                        if(capabilityDetail.query != undefined) {
                            var sQueryValue = "";
                            for(var m= 0; m< capabilityDetail.query.length; m++){
                                if(m > 0)
                                    sQueryValue += ",";
                                if(capabilityDetail.query[m] == 'set'){
                                    if(!capabilityDetail.enums || (capabilityDetail.enums && capabilityDetail.enums.length > 1))
                                        Item.bReadOnly = false;
                                    Item.OperationType += 0x0002;
                                } else if (capabilityDetail.query[m] == 'get'){
                                    Item.OperationType += 0x0001;
                                    Item.inquirable = true;
                                } else if (capabilityDetail.query[m] == 'reset'){
                                    Item.OperationType += 0x0010;
                                }	
                                sQueryValue += (capabilityDetail.query[m].charAt(0).toUpperCase() + capabilityDetail.query[m].slice(1));
                            }
                            _newTD.innerText = sQueryValue;
                        }
                        break;
                    default:
                        _newTD.style.textAlign = "center";
                }
                _newTR.appendChild(_newTD);
                
            }
            document.getElementById('tBodyCAPList').appendChild(_newTR);
            m_pCapSettings["CAP_" + Item.CapID] = Item;
            
            if(Item.bReadOnly)
                $("#tblCAPList tr#CAP_" + Item.CapID).addClass("ReadOnly");
            
            addChanged(Item);
            
            $("#tblCAPList tr#CAP_" + Item.CapID).off("dblclick").on("dblclick", function () {
                var strCapID = this.id;
                OnNMDblclkCaps(strCapID.match(/\d+/)[0]);
            });
        }
        
        $("tr").off("mouseover").on("mouseover", function () {
                $(this).addClass("over");
            });

            $("tr").off("mouseout").on("mouseout", function () {
                $(this).removeClass("over");
            });
            
    }, function(error){
        console.log(error);
    });
}

function getCurrentValue(capabilityDetail){
    var strReturn;
    if(capabilityDetail.conType != undefined && capabilityDetail.conType.value == TWON_ARRAY){
        var sItemValue = [];
        for(var i = 0; i < capabilityDetail.values.length; i++){
            if(capabilityDetail.values[i].label != undefined){
                sItemValue.push(capabilityDetail.values[i].label);
            } else {
                sItemValue.push(convertCAP_Item_toString(capabilityDetail.valueType.value, capabilityDetail.values[i]));
            }
        }
        strReturn = sItemValue.join(", ");
    } else {
        if(capabilityDetail.curValue != undefined){
            if(capabilityDetail.curValue.label != undefined){
                strReturn = capabilityDetail.curValue.label;
                if(strReturn == 'true' || strReturn == 'false')
                    strReturn = strReturn.charAt(0).toUpperCase() + strReturn.slice(1);
            } else if(capabilityDetail.valueType.value == TWTY_FRAME){
                strReturn = "[" + capabilityDetail.curValue.left.toFixed(3) + " " + capabilityDetail.curValue.right.toFixed(3) + " " + capabilityDetail.curValue.top.toFixed(3) + " " + capabilityDetail.curValue.bottom.toFixed(3)+ "]";
            } else {
                strReturn = convertCAP_Item_toString(capabilityDetail.valueType.value, capabilityDetail.curValue);
            }
        }
    }
    
    return strReturn;
}

function getArrayStringValues(capabilityDetail){
    var strReturn = [], value = "";
    if(capabilityDetail.conType != undefined){
        if(capabilityDetail.conType.value == TWON_ENUMERATION){
            for(var i= 0; i< capabilityDetail.enums.length; i++){
                if(capabilityDetail.enums[i].label != undefined){

                    strReturn.push(capabilityDetail.enums[i].label);
                } else {
                    strReturn.push(convertCAP_Item_toString(capabilityDetail.valueType.value, capabilityDetail.enums[i]));
                }
            }
        } else if(capabilityDetail.conType.value == TWON_RANGE){
            var _min = capabilityDetail.minValue, 
                _max = capabilityDetail.maxValue,
                _step = capabilityDetail.stepSize,
                _value = capabilityDetail.curValue;
            if(capabilityDetail.valueType.value == TWTY_INT16 || capabilityDetail.valueType.value == TWTY_INT32){
                _min = _min | 0;
                _max = _max | 0;
                _step = _step | 0;
                _value = _value | 0;
            }
            var rangeValues = _min  + ',' + _max + ',' + _step + ',' + _value;
            strReturn.push(rangeValues);
        } else if(capabilityDetail.conType.value == TWON_ARRAY){
            for(var i = 0; i < capabilityDetail.values.length; i++){
                if(capabilityDetail.values[i].label != undefined){
                    strReturn.push(capabilityDetail.values[i].label);
                } else {
                    strReturn.push(convertCAP_Item_toString(capabilityDetail.valueType.value, capabilityDetail.values[i]));
                }
            }	
        } else {
            if(capabilityDetail.curValue != undefined){
                if(capabilityDetail.curValue.label != undefined){
                    value = capabilityDetail.curValue.label.charAt(0).toUpperCase() + capabilityDetail.curValue.label.slice(1);
                    strReturn.push(value);
                }
            } else if(capabilityDetail.valueType.value == TWTY_FRAME){
                value = "[" + capabilityDetail.curValue.left.toFixed(3) + " " + capabilityDetail.curValue.right.toFixed(3) + " " + capabilityDetail.curValue.top.toFixed(3) + " " + capabilityDetail.curValue.bottom.toFixed(3)+ "]";
                strReturn.push(value);
            } else {
                strReturn.push(convertCAP_Item_toString(capabilityDetail.valueType.value, capabilityDetail.curValue));
            }
        }
    } else if(capabilityDetail.curValue != undefined){
        if(capabilityDetail.curValue.label != undefined){
            value = capabilityDetail.curValue.label.charAt(0).toUpperCase() + capabilityDetail.curValue.label.slice(1);
            strReturn.push(value);
        } else if(capabilityDetail.valueType.value == TWTY_FRAME){
            value = "[" + capabilityDetail.curValue.left.toFixed(3) + " " + capabilityDetail.curValue.right.toFixed(3) + " " + capabilityDetail.curValue.top.toFixed(3) + " " + capabilityDetail.curValue.bottom.toFixed(3)+ "]";
            strReturn.push(value);
        } else {
            if(capabilityDetail.valueType != undefined && capabilityDetail.valueType.value != undefined)
                strReturn.push(convertCAP_Item_toString(capabilityDetail.valueType.value, capabilityDetail.curValue));
        }	
    }
            
    return strReturn;
}

function getActualValues(capabilityDetail){
	var strReturn = [];
	if(capabilityDetail.conType != undefined){
		if(capabilityDetail.conType.value == TWON_ENUMERATION){
			if(capabilityDetail.valueType.value == TWTY_FRAME){
				var values = [];
				values.push(capabilityDetail.curValue.left.toFixed(3));
				values.push(capabilityDetail.curValue.right.toFixed(3));
				values.push(capabilityDetail.curValue.top.toFixed(3));
				values.push(capabilityDetail.curValue.bottom.toFixed(3));
				strReturn.push(values);
			} else {
				for(var i= 0; i< capabilityDetail.enums.length; i++){
					if(capabilityDetail.enums[i].value != undefined)
						strReturn.push(capabilityDetail.enums[i].value);
					else
						strReturn.push(capabilityDetail.enums[i]);
				}
			}
		} else if(capabilityDetail.conType.value == TWON_RANGE){
			var _min = capabilityDetail.minValue, 
				_max = capabilityDetail.maxValue,
				_step = capabilityDetail.stepSize,
				_value = capabilityDetail.curValue;
			if(capabilityDetail.valueType.value == TWTY_INT16 || capabilityDetail.valueType.value == TWTY_INT32){
				_min = _min | 0;
				_max = _max | 0;
				_step = _step | 0;
				_value = _value | 0;
			}
			var rangeValues = {
				min: _min,
				max: _max,
				step: _step,
				value: _value
			};
			strReturn.push(rangeValues);
		} else if(capabilityDetail.conType.value == TWON_ARRAY){
			for(var i = 0; i < capabilityDetail.values.length; i++){
				strReturn.push(capabilityDetail.values[i]);
			}
		} else {		
			if(capabilityDetail.valueType.value == TWTY_FRAME){
				var values = [];
				values.push(capabilityDetail.curValue.left.toFixed(3));
				values.push(capabilityDetail.curValue.right.toFixed(3));
				values.push(capabilityDetail.curValue.top.toFixed(3));
				values.push(capabilityDetail.curValue.bottom.toFixed(3));
				strReturn.push(values);
			} else {
				if(capabilityDetail.curValue != undefined){
					if(capabilityDetail.curValue.value != undefined){
						strReturn.push(capabilityDetail.curValue.value);
					} else {
						strReturn.push(capabilityDetail.curValue);
					}
				}
			}
		}
	} else {		
		if(capabilityDetail.curValue != undefined){
			if(capabilityDetail.curValue.value != undefined){
				strReturn.push(capabilityDetail.curValue.value);
			} else {
				strReturn.push(capabilityDetail.curValue);
			}	
		}
		
	}
	
	return strReturn;
}

function getCurrentValue(capabilityDetail){
	var strReturn;
	if(capabilityDetail.conType != undefined && capabilityDetail.conType.value == TWON_ARRAY){
		var sItemValue = [];
		for(var i = 0; i < capabilityDetail.values.length; i++){
			if(capabilityDetail.values[i].label != undefined){
				sItemValue.push(capabilityDetail.values[i].label);
			} else {
				sItemValue.push(convertCAP_Item_toString(capabilityDetail.valueType.value, capabilityDetail.values[i]));
			}
		}
		strReturn = sItemValue.join(", ");
	} else {
		if(capabilityDetail.curValue != undefined){
			if(capabilityDetail.curValue.label != undefined){
				strReturn = capabilityDetail.curValue.label;
				if(strReturn == 'true' || strReturn == 'false')
					strReturn = strReturn.charAt(0).toUpperCase() + strReturn.slice(1);
			} else if(capabilityDetail.valueType.value == TWTY_FRAME){
				strReturn = "[" + capabilityDetail.curValue.left.toFixed(3) + " " + capabilityDetail.curValue.right.toFixed(3) + " " + capabilityDetail.curValue.top.toFixed(3) + " " + capabilityDetail.curValue.bottom.toFixed(3)+ "]";
			} else {
				strReturn = convertCAP_Item_toString(capabilityDetail.valueType.value, capabilityDetail.curValue);
			}
		}
	}
	
	return strReturn;
}

function getCurrentIndex(capabilityDetail){
	var strReturn = -1;
	if(capabilityDetail.curValue != undefined){
		
		if(capabilityDetail.curValue.value != undefined){
			if(capabilityDetail.conType.value == TWON_ENUMERATION){
				strReturn = capabilityDetail.curValue.value;
			}
		}
	}
	
	return strReturn;
}

function convertCAP_Item_toString(_unType, _unItem) {
	var pszString;
	switch (_unType) {
		case TWTY_UINT8:
		case TWTY_UINT16:
		case TWTY_UINT32:
			pszString = parseInt(_unItem).toString() + " [0x" + _unItem.toString(16) + "]";
			break;
		case TWTY_INT8:
		case TWTY_INT16:
		case TWTY_INT32:
			pszString = _unItem | 0;
			break;
		case TWTY_FIX32:
			pszString = _unItem.toFixed(3);
			break;
		case TWTY_BOOL:
			pszString = _unItem ? "True" : "False";
			break;
		default: 
			pszString = _unItem;
			break;
	}
	return pszString;
}

function addChanged(Item, value){
	if(value != undefined)
		$("#tblCAPList tr#CAP_" + Item.CapID + " td:nth-child(2)").html(value);
	 
	$("#tblCAPList tr#CAP_" + Item.CapID + " td").removeClass();
	if (Item.byChanged != 0)
		$("#tblCAPList tr#CAP_" + Item.CapID + " td:nth-child(8)").html("-1");
	else
		$("#tblCAPList tr#CAP_" + Item.CapID + " td:nth-child(8)").html($("#tblCAPList tr#CAP_" + Item.CapID + " td:nth-child(7)").html());
	if (Item.byChanged & 0x0001) // Value Changed
		$("#tblCAPList tr#CAP_" + Item.CapID + " td:nth-child(" + 2 + ")").addClass("Changed");
	if (Item.byChanged & 0x0002) // Con Type Changed
		$("#tblCAPList tr#CAP_" + Item.CapID + " td:nth-child(" + 4 + ")").addClass("Changed");
	if (Item.byChanged & 0x0004) // Number Count Changed
		$("#tblCAPList tr#CAP_" + Item.CapID + " td:nth-child(" + 5 + ")").addClass("Changed");
	if (Item.byChanged & 0x0008) // Op Type Changed
		$("#tblCAPList tr#CAP_" + Item.CapID + " td:nth-child(" + 6 + ")").addClass("Changed");
}

// This method sets the new current value.
// TODO set constraints using Enumerations and Ranges
function OnNMDblclkCaps(_CapID) {
    var _type, _val, _btn,
        newValue, _valueList = [],
        _valueItemClass = " ",
        _checkedornot = false,
        // get the capability that is supported        
        Cap = m_pCapSettings["CAP_" + _CapID];
    var updateTable = function (_nID) { //_nID
		if (globalRuntime.neverShowTheWarningAgain) {
			if (globalRuntime.bReloadAll) {
				setTimeout(function () {
					ListSupportedCaps(true);
				}, 100);
			} else {
				setTimeout(function () {
					getCapability(true, _nID);
				}, 100);
			}
			return;
		}
		// Modifiying one CAP can change several others - repopulate the list of CAPS
		$("#ValueSelector").html([
			"<p>Reload the entire form will be <strong>time-consuming</strong> but will show you which ",
			"capabilities have changed related to the change you just made.",
			"<br /><br /> Do you want to reload the entire form?</p>",
			"<br /><br /><input type='checkbox' id='neverShowTheWarningAgain'> Don't ask again"
		].join(""));
		$("#ValueSelector").dialog({
			title: "Do you want to reload the entire form?",
			resizable: true,
			width: 600,
			modal: true,
			buttons: {
				"Sure, Go ahead!": function () {
					if ($('#neverShowTheWarningAgain').prop("checked")) {
						globalRuntime.neverShowTheWarningAgain = true;
						globalRuntime.bReloadAll = true;
					}
					$("#ValueSelector").html("");
					$(this).dialog("close");
					Dynamsoft.Lib.showMask();
					setTimeout(function () {
						ListSupportedCaps(true);
						Dynamsoft.Lib.hideMask();
					}, 100);
				},
				"No, Time matters!": function () {
					if ($('#neverShowTheWarningAgain').prop("checked")) {
						globalRuntime.neverShowTheWarningAgain = true;
						globalRuntime.bReloadAll = false;
					}
					$("#ValueSelector").html("");
					$(this).dialog("close");
					Dynamsoft.Lib.showMask();
					setTimeout(function () {
						getCapability(true, _nID);
						Dynamsoft.Lib.hideMask();
					}, 100);
				}
			}
		});
		$("#ValueSelector").disableSelection();
    };
    // get possible values to populate dialog box with
    if (Cap.inquirable) {
        var _values = Cap.ActualValues,
            _strValues = Cap.ArrayStringValues,
            _currentValue = Cap.CurrentValue,
            bReadOnly = Cap.bReadOnly;
        _type = Cap.CapDetail.valueType.value;  // Cap.CapValueType;
        globalRuntime.CapabilityNegotiation = {
            id: _CapID,
            values: _values,
            oneValue: _currentValue,
            oldIndex: -1,
            newIndex: -1,
            rangeCurrentValue: null,
            EnumerationAsOneValue_New: null
        };
		
		var OnSuccess = function () {
			updateTable(Cap.CapID);
		};

		var OnFailure = function (errorCode, errorString) {

		};
				
        if (Cap.CapDetail.conType.value == TWON_ENUMERATION) {
            _valueList = [];
            _valueItemClass = " ";
            _checkedornot = false;
            $("#ValueSelector").html("");
			for (_val in _values) {
				if (_currentValue == _strValues[_val]) {
					_checkedornot = "checked";
					globalRuntime.CapabilityNegotiation.oldIndex = parseInt(_val);
					globalRuntime.CapabilityNegotiation.newIndex = parseInt(_val);
					_valueItemClass = "seletedValueItem";
				} else {
					_checkedornot = "";
					_valueItemClass = " ";
				}
				 if (_type == TWTY_FRAME) {
					 _valueList.push("<li class='" + _valueItemClass + "'><label for='" + "_values_" + _values[_val] +
					"'><input " + _checkedornot + " type='radio' name='_list_" + Cap.CapID +
					"' id='_values_" + _values[_val] + "' _index='" + _val + "'> " + _values[0] + " </label></li > ");
				 } else {
					_valueList.push("<li class='" + _valueItemClass + "'><label for='" + "_values_" + _values[_val] +
						"'><input " + _checkedornot + " type='radio' name='_list_" + Cap.CapID +
						"' id='_values_" + _values[_val] + "' _index='" + _val + "'> " + _strValues[_val] + " </label></li > ");
				 }
			}

			$("#ValueSelector").append(
				"<ul style='text-align:left'>" + _valueList.join("") +
				"</ul>"
			);
			$("#ValueSelector ul li").off("mouseover").on("mouseover", function () {
				$(this).addClass("over");
			});

			$("#ValueSelector ul li").off("mouseout").on("mouseout", function () {
				$(this).removeClass("over");
			});
			$("#ValueSelector ul").off("click").on("click", function () {
				$("#ValueSelector ul li").removeClass('seletedValueItem');
				$("input[name='_list_" + Cap.CapID + "']:checked").parent().parent().addClass('seletedValueItem');
			});
			$("#ValueSelector ul li").off("click").on("click", function () {
				$(this).find('input').prop('checked', true);
				globalRuntime.CapabilityNegotiation.newIndex = parseInt($(this).find('input').attr('_index'));
			});
        
            if (Cap.bReadOnly) {
                _btn = {
                    "Close": function () {
                        $("#ValueSelector").html("");
                        $(this).dialog("close");
                    }
                };
            } else
                _btn = {
                    "OK": function () {
                        if (Cap.CapDetail.enums.length <=1) {
                            if (globalRuntime.CapabilityNegotiation.EnumerationAsOneValue_New) {
								setCapability(Cap.CapID, globalRuntime.CapabilityNegotiation.EnumerationAsOneValue_New,  OnSuccess,  OnFailure);
                            } else return false;
                        } else {
                            if (globalRuntime.CapabilityNegotiation.newIndex != globalRuntime.CapabilityNegotiation.oldIndex) {
                                switch (_type) { //_type
                                    case TWTY_INT8:
                                    case TWTY_INT16:
                                    case TWTY_INT32:
                                    case TWTY_UINT8:
                                    case TWTY_UINT16:
                                    case TWTY_UINT32:
                                    case TWTY_BOOL:
                                    case TWTY_FIX32:
                                        var _objVerify = {
                                            valueBeforeSet: _values[Cap.CurrentIndex],
                                            valueAfterSet: null
                                        };
										setCapability(Cap.CapID, globalRuntime.CapabilityNegotiation.values[globalRuntime.CapabilityNegotiation.newIndex],  OnSuccess,  OnFailure);
                                        
                                        break;
                                    case TWTY_STR32:
                                    case TWTY_STR64:
                                    case TWTY_STR128:
                                    case TWTY_STR255:
										setCapability(Cap.CapID, globalRuntime.CapabilityNegotiation.values[globalRuntime.CapabilityNegotiation.newIndex],  OnSuccess,  OnFailure);
                                        break;
                                    default:
                                        PrintCMDMessage("Setting this data type is not implemented.  Patches welcome.", "Not Implemented");
                                        break;

                                }
                            }
                        }
                        $("#ValueSelector").html("");
                        $(this).dialog("close");
                    },
                    "Close": function () {
                        $("#ValueSelector").html("");
                        $(this).dialog("close");
                    }
                };
            $("#ValueSelector").dialog({
                title: convertCAP_toString(Cap.CapID),
                resizable: true,
                width: "auto",
				maxWidth: 500,
				height: "auto",
                maxHeight: 600,
                modal: true,
                buttons: _btn
            });
        } else if (Cap.CapDetail.conType.value == TWON_ONEVALUE) {
            if (bReadOnly) {
                alert("This Capability is Read-Only!");
                PrintCMDMessage("Can't Set Read-Only Capability " + convertCAP_toString(Cap.CapID));
                return;
            }
            if (_type == TWTY_BOOL) { // if true, set false, vice versa
                newValue = globalRuntime.CapabilityNegotiation.oneValue == "True" ? 0 : 1; //Cap.CapDetail.curValue.value? 0 : 1; //globalRuntime.CapabilityNegotiation.oneValue == "True" ? 0 : 1;
          
				setCapability(Cap.CapID, newValue, OnSuccess, OnFailure);// 'number');
            } else {
				  if (_type == TWTY_FRAME) {
					_valueItemClass = "ui-state-default";
					var _validate = function () {
						var bValidated = false;
						newValue = $.trim($("#EnumerationAsOneValue_New").val());
						if (newValue != "") {
							var _frameLRTB = newValue.split(","),
								bInvalid = false;
							if (_frameLRTB.length == 4) {
								$.each(_frameLRTB, function (_k, _o) {
									if (/^\s*$/.test(_o) || isNaN(_o))
										bInvalid = true;
									else {
										_frameLRTB[_k] = Number(_o);
									}
								});
							} else bInvalid = true;
							if (bInvalid) {
								$("#EnumerationAsOneValue_New").focus();
								$("#EnumerationAsOneValue_New").addClass("invalid");
								return false;
							} else {
								bValidated = true;
								globalRuntime.CapabilityNegotiation.EnumerationAsOneValue_New = _frameLRTB;
								//$("#EnumerationAsOneValue li:last").html("New: " + newValue);
								$("#EnumerationAsOneValue_New").removeClass("invalid");
							}
						} else
							$("#EnumerationAsOneValue_New").focus();
						return bValidated;
					};
					$("#ValueSelector").html("");
					$("#ValueSelector").append(
						["<ul id='EnumerationAsOneValue' style='text-align:left'>",
							"<li class='", _valueItemClass, "'>",
							"Old: <span>", _values[0], " (", _currentValue, ")",
							"</span></li>",
							"<li class='", _valueItemClass, "'>",
							"New: <input id='EnumerationAsOneValue_New' type='text' style='width:60%'/>",
							"</ul>"
						].join("")
					);
					$("#EnumerationAsOneValue_New").focus();
					$("#EnumerationAsOneValue_New").off('blur').on('blur', function () {
						_validate();
						//$("#EnumerationAsOneValue_New").focus();
					});
					$("#EnumerationAsOneValue_New").off('keypress').on('keypress', function (event) {
						if (event.which == 13) {
							event.preventDefault();
							_validate();
						}
					});
					$("#EnumerationAsOneValue li:last").off('click').on('click', function (event) {
						switch ($("#EnumerationAsOneValue li:last input").length) {
							case 0:
								$("#EnumerationAsOneValue li:last").html(
									"New: <input id='EnumerationAsOneValue_New' type='text' style='width:60%'/>"
								);
								$("#EnumerationAsOneValue_New").text(globalRuntime.CapabilityNegotiation.EnumerationAsOneValue_New);
								break;
							case 1:
								/** Do nothing */
								break;
						}
					});
				}  else {
					$("#ValueSelector").html("");
					$("#ValueSelector").append(
						"<input type='text' style='text-align:left'/>"
					);
					if (_currentValue.toString().indexOf('[0x') != -1) {
						_currentValue = _currentValue.substr(0, _currentValue.indexOf('[0x') - 1);
					}
					$("#ValueSelector input").val(_currentValue);
				}
                if (Cap.bReadOnly) {
                    $("#ValueSelector input").prop("disabled", "disabled");
                    _btn = {
                        "Close": function () {
                            $("#ValueSelector").html("");
                            $(this).dialog("close");
                        }
                    };
                } else
                    _btn = {
                        "OK": function () {
							if (_type == TWTY_FRAME) {
								if(globalRuntime.CapabilityNegotiation.EnumerationAsOneValue_New != undefined){
									newValue = {
										left: globalRuntime.CapabilityNegotiation.EnumerationAsOneValue_New[0],
										right: globalRuntime.CapabilityNegotiation.EnumerationAsOneValue_New[1],
										top: globalRuntime.CapabilityNegotiation.EnumerationAsOneValue_New[2],
										bottom: globalRuntime.CapabilityNegotiation.EnumerationAsOneValue_New[3]
									};
								} else {
									$("#EnumerationAsOneValue_New").focus();
									$("#EnumerationAsOneValue_New").addClass("invalid");
									return false;
								}
							} else {
								newValue = $.trim($("#ValueSelector input").val());
								if (_type < 8) { /* number */
									if (/^\s*$/.test(newValue) || isNaN(newValue)) {
										$("#ValueSelector input").focus();
										$("#ValueSelector input").addClass("invalid");
										return false;
									}
								}
							}
                            if (newValue != globalRuntime.CapabilityNegotiation.oneValue) {
                                switch (_type) {
                                    case TWTY_INT8:
                                    case TWTY_INT16:
                                    case TWTY_INT32:
                                    case TWTY_UINT8:
                                    case TWTY_UINT16:
                                    case TWTY_UINT32:
                                    case TWTY_FIX32:
										setCapability(Cap.CapID, Number(newValue), OnSuccess, OnFailure);
                                        break;
                                    case TWTY_STR32:
                                    case TWTY_STR64:
                                    case TWTY_STR128:
                                    case TWTY_STR255:
										setCapability(Cap.CapID, newValue, OnSuccess, OnFailure);
                                        break;
                                    case TWTY_FRAME:
										setCapability(Cap.CapID, newValue, OnSuccess, OnFailure);
                                        break;
                                    default:
                                        PrintCMDMessage("Setting this data type is not implemented.  Patches welcome.", "Not Implemented");
                                        break;
                                }
                            }
                            $("#ValueSelector").html("");
                            $(this).dialog("close");
                        },
                        "Close": function () {
                            $("#ValueSelector").html("");
                            $(this).dialog("close");
                        }
                    };
                $("#ValueSelector").dialog({
                    title: convertCAP_toString(Cap.CapID),
                    resizable: true,
                    width: "auto",
					maxWidth: 500,
					height: "auto",
					maxHeight: 600,
                    modal: true,
                    buttons: _btn
                });
            }
        } else if (Cap.CapDetail.conType.value == TWON_RANGE) {
            var _title = convertCAP_toString(Cap.CapID);
            $("#ValueSelector").html("");
            $("#ValueSelector").append(
                ["<div style='text-align:center'>",
                    "<span class='rangeCurrent' id='currentValue_", _title, "'>", _values[0].value, "</span><br />",
                    "<span>", _values[0].min, "</span>", "<input type = 'range' min = '",
                    _values[0].min, "' max='", _values[0].max, "' step='",
                    _values[0].step, "' value='", _values[0].value, "'/>",
                    "<span>", _values[0].max, "</span><br /></div>"
                ].join("")
            );
            $("#ValueSelector input").off('change').on('input', function (evt) {
                globalRuntime.CapabilityNegotiation.rangeCurrentValue = evt.originalEvent.target.value;
                $("#ValueSelector .rangeCurrent").html(evt.originalEvent.target.value);
            });
            if (Cap.bReadOnly) {
                $("#ValueSelector input").prop("disabled", "disabled");
                _btn = {
                    "Close": function () {
                        $("#ValueSelector").html("");
                        $(this).dialog("close");
                    }
                };
            } else _btn = {
                "OK": function () {
                    newValue = globalRuntime.CapabilityNegotiation.rangeCurrentValue;
                    if (_values[0].value != globalRuntime.CapabilityNegotiation.rangeCurrentValue) {
                        switch (_type) {
                            case TWTY_INT8:
                            case TWTY_INT16:
                            case TWTY_INT32:
                            case TWTY_UINT8:
                            case TWTY_UINT16:
                            case TWTY_UINT32:
                            case TWTY_FIX32:
								setCapability(Cap.CapID, Number(newValue),  OnSuccess,  OnFailure);
                                break;
                            default:
                                PrintCMDMessage("Setting this data type is not implemented.  Patches welcome.", "Not Implemented");
                                break;
                        }
                    }
                    $("#ValueSelector").html("");
                    $(this).dialog("close");
                },
                "Cancel": function () {
                    $("#ValueSelector").html("");
                    $(this).dialog("close");
                }
            };
            $("#ValueSelector").dialog({
                title: _title,
                resizable: true,
                width: "auto",
				maxWidth: 500,
				height: "auto",
                maxHeight: 600,
                modal: true,
                buttons: _btn
            });
        } else if (Cap.CapDetail.conType.value == TWON_ARRAY) {
			if(Cap.bReadOnly){
				_valueList = [];
				_valueItemClass = "ui-state-default";
				for (_val in _values) {
					var bJSON = false;
					var str = JSON.stringify(_values[_val]);
					try {
						JSON.parse(str);
						bJSON = true;
					} catch (e) {
					}
					var value =bJSON? str:_values[_val];
					_valueList.push("<li class='" + _valueItemClass + "'>" + value + "</li >");
				}
				$("#ValueSelector").html("");
				$("#ValueSelector").append(
					"<ul id='sortableArrayValues' style='text-align:left'>" + _valueList.join("") +
					"</ul>"
				);
				$("#sortableArrayValues").sortable();
				$("#sortableArrayValues").disableSelection();
				$.contextMenu('destroy', '#sortableArrayValues li');
				$.contextMenu({
					selector: '#sortableArrayValues li',
					callback: function (key, options) {
						switch (key) {
							case "delete":
								$(this).remove();
								break;
							case "add":
								$("#sortableArrayValues").append("<li class='" + _valueItemClass + "'><input id='sortableArrayValues_new' style='width:90%' type='text'></li >");
								$("#sortableArrayValues_new").focus();
								$("#sortableArrayValues_new").off('blur').on('blur', function () {
									$("#sortableArrayValues_new").focus();
								});

								$("#sortableArrayValues_new").off('keypress').on('keypress', function (event) {
									if (event.which == 13) {
										event.preventDefault();
										newValue = $.trim($("#sortableArrayValues_new").val());

										if (newValue != "") {
											if (_type < 8) { // number 
												if (!/^\s*$/.test(newValue) && !isNaN(newValue))
													$("#sortableArrayValues li:last").html(newValue);
												else {
													$("#sortableArrayValues_new").focus();
													$("#sortableArrayValues_new").addClass("invalid");
												}
											} else
												$("#sortableArrayValues li:last").html(newValue);
										} else
											$("#sortableArrayValues li:last").remove();
									}
								});
						}
					},
					items: {
						"add": {
							name: "Add",
							icon: "add"
						},
						"delete": {
							name: "Delete",
							icon: "delete"
						},
						"sep1": "---------",
						"quit": {
							name: "Quit",
							icon: function ($element, key, item) {
								return 'context-menu-icon context-menu-icon-quit';
							}
						}
					}
				});
           	
			} else {
				_valueItemClass = "ui-state-default";
				var _validate = function () {
					var bValidated = false;
					newValue = $.trim($("#EnumerationAsOneValue_New").val());
					if (newValue != "") {
						var _frameLRTB = [], //newValue.split(","),
							bInvalid = false, bJSONValue = false;
						if(newValue.indexOf('}') > 0){
							_frameLRTB = JSON.parse('[' + newValue + ']');
							bJSONValue = true;
						} else {
							_frameLRTB = newValue.split(",");
						}
						//if (_frameLRTB.length == 4) {
							$.each(_frameLRTB, function (_k, _o) {
								if(!bJSONValue){
									if (/^\s*$/.test(_o) || isNaN(_o))
										bInvalid = true;
									else {
										_frameLRTB[_k] = Number(_o);
									}
								} else {
									_frameLRTB[_k] = _o;
								}
							});
						//} else bInvalid = true;
						if (bInvalid) {
							//$("#EnumerationAsOneValue_New").focus();
							$("#EnumerationAsOneValue_New").addClass("invalid");
						} else {
							bValidated = true;
							globalRuntime.CapabilityNegotiation.EnumerationAsOneValue_New = _frameLRTB;
							$("#EnumerationAsOneValue_New").removeClass("invalid");
							//$("#EnumerationAsOneValue li:last").html("New: " + newValue);
						}
					} else
						$("#EnumerationAsOneValue_New").focus();
					return bValidated;
				};
				
				var valueList = [];
				for (_val in _values) {
					var bJSON = false;
					var str = JSON.stringify(_values[_val]);
					try {
						JSON.parse(str);
						bJSON = true;
					} catch (e) {
					}
					valueList.push(bJSON? str:_values[_val]);
				}
				
				$("#ValueSelector").html("");
				$("#ValueSelector").append(
					["<ul id='EnumerationAsOneValue' style='text-align:left; max-Width: 500px'>",
						"<li class='", _valueItemClass, "'>",
						"Old: <span>", valueList.join(","), " (", _currentValue, ")",
						"</span></li>",
						"<li class='", _valueItemClass, "'>",
						"New: <input id='EnumerationAsOneValue_New' type='text' style='width:60%'/>",
						"</ul>"
					].join("")
				);
				$("#EnumerationAsOneValue_New").focus();
				
				$("#EnumerationAsOneValue_New").off('blur').on('blur', function () {
					_validate();
					//$("#EnumerationAsOneValue_New").focus();
				});
				/*$("#EnumerationAsOneValue_New").off('keypress').on('keypress', function (event) {
					if (event.which == 13) {
						event.preventDefault();
						_validate();
					}
				});
				$("#EnumerationAsOneValue li:last").off('click').on('click', function (event) {
					switch ($("#EnumerationAsOneValue li:last input").length) {
						case 0:
							$("#EnumerationAsOneValue li:last").html(
								"New: <input id='EnumerationAsOneValue_New' type='text' style='width:60%'/>"
							);
							$("#EnumerationAsOneValue_New").text(globalRuntime.CapabilityNegotiation.EnumerationAsOneValue_New);
							break;
						case 1:
							// Do nothing 
							break;
					}
				});*/
			}
					
           
		   if (Cap.bReadOnly) {
                //$.contextMenu('destroy', '#sortableArrayValues li');
                _btn = {
                    "Close": function () {
                        $("#ValueSelector").html("");
                        $(this).dialog("close");
                    }
                };
            } else _btn = {
                "OK": function () {
                    var _newValues = [],
                        bValueChanged = false;
                    //$.each($("#sortableArrayValues li"), function (key, _item) {
                    //    _newValues.push($(_item).html());
                    //});
					if(_validate() == false){
						$("#EnumerationAsOneValue_New").addClass("invalid");
						return false;
					}
					_newValues = globalRuntime.CapabilityNegotiation.EnumerationAsOneValue_New;
					//if(_newValues == undefined){
					//	$("#EnumerationAsOneValue_New").addClass("invalid");
					//	return false;
					//}
					
                    if (_newValues.length != _values.length) bValueChanged = true;
                    else {
                        for (i = 0; i < _newValues.length; i++) {
                            if (_newValues[i] != _values[i].toString()) {
                                bValueChanged = true;
                                break;
                            }
                        }
                    }
                    if (bValueChanged) {
                        switch (_type) {
                            case TWTY_INT8:
                            case TWTY_INT16:
                            case TWTY_INT32:
                            case TWTY_UINT8:
                            case TWTY_UINT16:
                            case TWTY_UINT32:
                            case TWTY_BOOL:
                            case TWTY_FIX32:
								setCapability_Array(Cap.CapID, _newValues, OnSuccess, OnFailure);
                                break;
                            case TWTY_STR32:
                            case TWTY_STR64:
                            case TWTY_STR128:
                            case TWTY_STR255:
								setCapability_Array(Cap.CapID, _newValues, OnSuccess, OnFailure);
                                break;
                            default:
                                PrintCMDMessage("Setting this data type is not implemented.  Patches welcome.", "Not Implemented");
                                break;
                        }
                    }
                    $("#ValueSelector").html("");
                    $(this).dialog("close");
                },
                "Close": function () {
                    $("#ValueSelector").html("");
                    $(this).dialog("close");
                }
            };
            $("#ValueSelector").dialog({
                title: convertCAP_toString(Cap.CapID),
                resizable: true,
                width: "auto",
                //minHeight: 100 + 50 * (_values.length + 1),
                //maxHeight: 800,
				height: "auto",
                maxHeight: 600,
                modal: true,
                buttons: _btn
            });
        } else {
            PrintCMDMessage("Unknown Capability Type, unable to Set this Capability!");
        }
    } else {
        PrintCMDMessage("Unable to Set this Capability!");
    }
}

function getCapability(bChange, Cap) {
    if (DWTObject) {
		DWTObject.getCapabilities([Cap], function(info){
			var capabilityDetail = info[0];
			m_pCapSettings["CAP_" + Cap].CurrentValue = getCurrentValue(capabilityDetail);
			m_pCapSettings["CAP_" + Cap].ArrayStringValues = getArrayStringValues(capabilityDetail);
			m_pCapSettings["CAP_" + Cap].ActualValues = getActualValues(capabilityDetail);
			m_pCapSettings["CAP_" + Cap].CurrentIndex = getCurrentIndex(capabilityDetail);
			m_pCapSettings["CAP_" + Cap].byChanged = bChange;
			addChanged(m_pCapSettings["CAP_" + Cap], getCurrentValue(capabilityDetail));
		}, function(errorCode, errorString){
			console.error(errorCode);
			console.error(errorString);
			printError("Failed to get the capability");
		});		
    }
}

function setCapability_Array(Cap, _value, successCallBack, failureCallBack) {
	if (DWTObject) {
		DWTObject.setCapabilities(
			{
				exception: "fail", //"ignore",
				capabilities: [
					{
						capability: Cap,
						values: _value, // your own curValue
					}
				],
			}, function () {
				PrintCMDMessage("Setting Capability Succeeded");
				m_pCapSettings["CAP_" + Cap].byChanged = 1;
				successCallBack();
			}, function (errorData) {
				console.log(errorData.capabilities[0].errorString);
				printError("Failed to set the capability");
				failureCallBack();
			});

		return true;
	}
}

function setCapability(Cap, _value, successCallBack, failureCallBack) {
    if (DWTObject) {		
		DWTObject.setCapabilities(
		  {
			exception: "fail", //"ignore",
			capabilities: [
			  {
				capability: Cap, 
				curValue: _value, // your own curValue
			  }
			],
		  }, function(){
			PrintCMDMessage("Setting Capability Succeeded");
			m_pCapSettings["CAP_" + Cap].byChanged = 1;
			successCallBack();
		  }, function(errorData){
			console.log(errorData.capabilities[0].errorString);
			printError("Failed to set the capability");
			failureCallBack();
		  });
		  
		  return true;
    }
}

function resetCapability(Cap){
	if (DWTObject) {
		var newValue; 
		var Item = m_pCapSettings["CAP_" + Cap];
		if (Item.CapDetail.conType.value == TWON_ONEVALUE) {
			if(Item.CapDetail.valueType.value == TWTY_BOOL)
				newValue = Item.CapDetail.curValue.value? 1 : 0; 
			else {
				if(Item.CapDetail.curValue.value != undefined)
					newValue = Item.CapDetail.curValue.value; 
				else
					newValue = Item.CapDetail.curValue;
			}
		} else {
			if(Item.CapDetail.curValue.value != undefined)
				newValue = Item.CapDetail.curValue.value; 
			else
				newValue = Item.CapDetail.curValue;
		}
		setCapability(Cap, newValue,
		function(){
			PrintCMDMessage("Resetting Capability Succeeded");
			getCapability(true, Cap);
		}, function(){
			 PrintCMDMessage("Failed to Reset" + convertCAP_toString(Cap));
		});
    }
}

$(function () {
    $.contextMenu({
        selector: '#tblCAPList',
        build: function ($trigger, evt) {
            // this callback is executed every time the menu is to be shown
            // its results are destroyed every time the menu is hidden
            // e is the original contextmenu event, containing e.pageX and e.pageY (amongst other data)
            var _items = {
                "sort": {
                    name: "Enable Sorting",
                    icon: "sort"
                },
                "reset": {
                    name: "Reset Sorting",
                    icon: "delete"
                },
                "refreshAll": {
                    name: "Refresh All",
                    icon: "delete"
                },
                "sep2": "---------",
                "quit": {
                    name: "Quit",
                    icon: function ($element, key, item) {
                        return 'context-menu-icon context-menu-icon-quit';
                    }
                }
            };
            if (DWTObject) {
                var strIDOfSelector = $(evt.target).parent().attr('id');
                if (strIDOfSelector && strIDOfSelector.indexOf("CAP_") != -1) {
                    globalRuntime.nCurrentCAPId = Number(strIDOfSelector.substr(4));
                    $(strIDOfSelector).addClass("over");
                    var _newItems = {},
                        bEmpty = true;
                    if (m_pCapSettings[strIDOfSelector].OperationType & TWQC_GET) {
                        _newItems.getCap = {
                            name: "Get " + convertCAP_toString(globalRuntime.nCurrentCAPId),
                            icon: "get"
                        };
                        bEmpty = false;
                    }
                    if (m_pCapSettings[strIDOfSelector].OperationType & TWQC_SET) {
                        _newItems.setCap = {
                            name: "Set " + convertCAP_toString(globalRuntime.nCurrentCAPId),
                            icon: "set"
                        };
                        bEmpty = false;
                    }
                    if (m_pCapSettings[strIDOfSelector].InitialValue != m_pCapSettings[strIDOfSelector].CurrentValue &&
                        (m_pCapSettings[strIDOfSelector].OperationType & TWQC_RESET)) {
                        _newItems.resetCap = {
                            name: "Reset " + convertCAP_toString(globalRuntime.nCurrentCAPId),
                            icon: "reset"
                        };
                        bEmpty = false;
                    }
                    if (bEmpty == false)
                        _newItems = $.extend(_newItems, {
                            "sep1": "---------"
                        });
                    _items = $.extend(_newItems, _items);
                }
            }

            return {
                callback: function (key, options) {
                    switch (key) {
                        case "getCap":
							getCapability(false, globalRuntime.nCurrentCAPId);
                            break;
                        case "setCap":
                            OnNMDblclkCaps(globalRuntime.nCurrentCAPId);
                            break;
                        case "resetCap":
                            resetCapability(globalRuntime.nCurrentCAPId);
                            break;
                        case "sort":
                            if (!$("#tblCAPList")[0].hasInitialized)
                                $("#tblCAPList").tablesorter({
                                    cssAsc: "sortUp",
                                    cssDesc: "sortDown",
                                    widgets: ["zebra"]
                                });
                            break;
                        case "reset":
                            $.tablesorter.destroy($("#tblCAPList"), true, function () {});
                            $("#tblCAPList").tablesorter({
                                sortList: [
                                    [6, 0]
                                ],
                                cssAsc: "sortUp",
                                cssDesc: "sortDown",
                                widgets: ["zebra"]
                            });
                            break;
                        case "refreshAll":
                            Dynamsoft.Lib.showMask();
                            setTimeout(function () {
								ListSupportedCaps(false, false);
								Dynamsoft.Lib.hideMask();
                            }, 100);
                            break;
                    }
                },
                items: _items
            };
        }
    });
});

function addContextMenuToDWTViewer() {
    $.contextMenu({
        selector: '#' + Dynamsoft.DWT.Containers[0].ContainerId,
        build: function ($trigger, evt) {
            if (DWTObject) {
                var _newIndex = Number($(evt.target).parent().parent().children().text()) - 1;
                if (DWTObject.CurrentImageIndexInBuffer != _newIndex)
                    setTimeout(function () {
                        DWTObject.CurrentImageIndexInBuffer = _newIndex;
                    }, 0);
            }
            return {
                callback: function (key, options) {
                    switch (key) {
                        case "remove":
                            if (DWTObject)
                                DWTObject.RemoveImage(DWTObject.CurrentImageIndexInBuffer);
                            break;
                        case "removeAll":
                            if (DWTObject)
                                DWTObject.RemoveAllImages();
                            break;
                        case "fold1-key1":
                            if (DWTObject)
                                DWTObject.SetViewMode(1, 1);
                            break;
                        case "fold1-key2":
                            if (DWTObject)
                                DWTObject.SetViewMode(4, 2);
                            break;
                        case "fold1-key3":
                            if (DWTObject)
                                DWTObject.SetViewMode(6, 3);
                            break;
                    }
                },
                items: {
                    "remove": {
                        name: "Remove",
                        icon: "delete"
                    },
                    "removeAll": {
                        name: "Remove All",
                        icon: "delete"
                    },
                    "sep1": "---------",
                    "fold1": {
                        "name": "View Mode",
                        "items": {
                            "fold1-key1": {
                                "name": "1 X 1"
                            },
                            "fold1-key2": {
                                "name": "4 X 2"
                            },
                            "fold1-key3": {
                                "name": "6 X 3"
                            }
                        }
                    },
                    "sep2": "---------",
                    "quit": {
                        name: "Quit",
                        icon: function ($element, key, item) {
                            return 'context-menu-icon context-menu-icon-quit';
                        }
                    }
                }
            };
        }
    });
}


function PrintCMDMessage(txt, type) {
    console.log(txt);
    if (type == 'popup')
        alert(txt);
}

function printError(txt) {
    PrintCMDMessage(txt, true);
    if (DWTObject) {
        textStatus = "An error has occurred. The error is " + DWTObject.ErrorString;
        PrintCMDMessage(textStatus, 'popup');
    }
}