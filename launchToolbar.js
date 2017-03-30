/*global jQuery, window, document, setTimeout, GM_setClipboard, GM_openInTab, GM_setValue, GM_getValue, GM_addValueChangeListener, setInterval */

//TODO
//Launch Id - done
//Account - done
//WebID - done
//WebID Text - done
//Webnum - done
//Proof Due Date - done
//Expected Launch Date - done
//BAC code - Done
//Account number - Done

(function () {
    // Tampermonkey functions

    function openInTab(url) {
        GM_openInTab(url, 'insert');
    }

    function setValue(variable, val) {
        console.log('"SET" value "' + variable + '" with "' + val + '"');
        GM_setValue(variable, val);
    }

    function getValue(variable) {
        console.log('getting ' + variable + ' with ' + GM_getValue(variable, 'false'));
        return GM_getValue(variable, 'false');
    }

    var launchToolbar = {
            init: function () {
                this.createElements();
                this.cacheDOM();
                this.changeTab();
                this.buildWSMlink();
                this.caseCheck();
                //            this.parentCheck();
                this.buildFolderPath();
                this.openAccountInfoPage();
                this.bindEvents();
                this.addStyles();
                this.buildTool();
                this.attachTool();
                this.startTool();
                this.BACtable();
            },
            createElements: function () {
                launchToolbar.config = {
                    $placeholder: jQuery('<div>').css({
                        height: '50px',
                        display: 'none'
                    }),
                    $uiBox: jQuery('<div>').attr({
                        id: 'uiBox'
                    }).css({
                        position: 'fixed',
                        display: 'none',
                        //                    display: 'inline-block',
                        'z-index': '9999',
                        background: 'linear-gradient(to left, #FFAFBD , #ffc3a0)',
                        color: '#000',
                        'text-align': 'left',
                        //                    'font-family': 'Arial',
                        'font-size': '12px',
                        //                    height: '25px',
                        width: '99%',
                        'font-weight': 'bold',
                        //                                        top: '0',
                        //                                        right: '0',
                        //                    '-moz-border-radius': '10px 0 0 10px',
                        '-moz-border-radius': '10px',
                        'border-radius': '10px',
                        //                    'border-radius': '10px 0 0 10px',
                        border: '1px #AAA solid',
                        'border-right': '0',
                        'padding': '7px 0px',
                        'font-family': '"Montserrat"'
                        //                    'padding-right': '80px'
                    }),
                    $toggleOn: jQuery('<div>').attr({
                        id: 'toggleOn',
                        class: 'myClass'
                    }).css({
                        float: 'left',
                        padding: '0px 10px',
                        cursor: 'pointer'
                    }),
                    $toggleOff: jQuery('<div>').attr({
                        id: 'toggleOff',
                        class: 'myClass'
                    }).css({
                        float: 'left',
                        padding: '0px 10px',
                        display: 'none',
                        cursor: 'pointer',
                        'border-right': '1px black solid'
                    }),
                    base: 'http://websites.cobalt.com/wsm/index.do?webId=',
                    us: '&locale=en_US',
                    en_ca: '&locale=en_CA',
                    fr_ca: '&locale=fr_CA',
                    au: '&locale=en_AU',
                    nz: '&locale=en_NZ',
                    wsmLink: '',
                    $resultBox: jQuery('<div>').attr({
                        id: 'resultBox'
                    }).css({
                        display: 'none',
                        'float': 'right',
                        color: 'red',
                        'background-color': 'white',
                        padding: '0 15px',
                        margin: '2px 0 0 40px',
                        '-moz-border-radius': '8px',
                        'border-radius': '8px',
                        border: '2px #aaa solid',
                        cursor: 'text'
                    }),
                    $casesMade: jQuery('<div>').css({
                        color: 'purple',
                        'margin-left': '5px'
                    }).html('<b>Cases Created</b>'),
                    $toolbarStyles: jQuery('<style>').attr({
                        id: 'qa_toolbox',
                        type: 'text/css'
                    }),
                    $jQueryLink: jQuery('<script>').attr({
                        type: 'text/javascript',
                        src: 'https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js'
                    }),
                    $montFontLink: jQuery('<link>').attr({
                        rel: 'stylesheet',
                        href: 'https://fonts.googleapis.com/css?family=Montserrat:500'
                    }),
                    baseManuLoc: '\\\\las-mgmt1.lasisi01a.las.san.dsghost.net\\Associate\\sea\\CS\\graphics\\manufacturers\\',
                    nitra: 'http://nitra.',
                    wip: 'wip.',
                    proof: 'proof.',
                    reload: '/?reload=true',
                    liveSiteURL: '',
                    wipSiteURL: '',
                    proofSiteURL: '',
                    folderPath: '',
                    $accountName: jQuery('<div>').attr({
                        class: 'accountName funcButtons imp click-able',
                        title: 'Copy Account Name'
                    }).css({
                        padding: '3px 15px 0',
                        color: 'rgb(110, 55, 215)',
                        'padding-top': '0px'
                    }).html('<div class="myTitle">Account</div>'),
                    $EditLink: jQuery('<a>').attr({
                        target: '_new',
                        class: 'WSMedit funcButtons myClass',
                        title: 'Edit in WSM'
                    }).css({
                        float: 'right'
                    }).text('EDIT in WSM'),
                    $webIDtext: jQuery('<div>').attr({
                        class: 'webIDtext funcButtons imp click-able',
                        title: 'Copy WebID Text'
                    }).css({
                        color: 'rgb(180, 120, 120)'
                    }).html('<div class="myTitle">WebID Text</div>'),
                    $launchID: jQuery('<div>').attr({
                        class: 'launchID funcButtons imp click-able',
                        title: 'Copy Launch ID'
                    }).css({
                        color: 'rgb(255, 0, 0)'
                    }).html('<div class="myTitle">Launch ID</div>'),
                    $idCombo: jQuery('<div>').attr({
                        title: 'Copy WebID and Launch',
                        class: 'funcButtons myClass click-able'
                    }).css({
                        'float': 'right',
                    }),
                    $plusIcon: jQuery('<i>').attr({
                        class: 'fa fa-plus fa-lg myClass idCombo click-able',
                        'aira-hidden': 'true',
                        title: 'Copy Launch ID + Web ID'
                    }).css({
                        float: 'right'
                    }),
                    $copyWebID: jQuery('<div>').attr({
                        title: 'Copy WebID',
                        class: 'copyWebid funcButtons imp click-able'
                    }).css({
                        color: 'rgb(255, 20, 155)'
                    }).html('<div class="myTitle">Web ID</div>'),
                    $webnum: jQuery('<div>').attr({
                        title: 'Copy Webnum',
                        class: 'copyWebnum funcButtons imp click-able'
                    }).css({
                        color: 'rgb(219, 112, 147)'
                    }).html('<div class="myTitle">Webnum</div>'),
                    $proofDate: jQuery('<div>').attr({
                        title: 'Proof Date',
                        class: 'funcButtons imp'
                    }).css({
                        color: 'rgb(0, 100, 0)'
                    }).html('<div class="myTitle">Proof Date</div>'),
                    $launchDate: jQuery('<div>').attr({
                        title: 'Launch Date',
                        class: 'funcButtons imp'
                    }).css({
                        color: 'rgb(165, 115, 50)'
                    }).html('<div class="myTitle">Launch Date</div>'),
                    $wipSite: jQuery('<a>').attr({
                        target: '_new',
                        class: 'wipSite funcButtons click-able myClass',
                        title: 'View WIP Site'
                    }).css({
                        float: 'right'
                    }).text('WIP'),
                    $proofSite: jQuery('<a>').attr({
                        target: '_new',
                        class: 'proofSite funcButtons click-able myClass',
                        title: 'View PROOF Site'
                    }).css({
                        float: 'right'
                    }).text('PROOF'),
                    $liveSite: jQuery('<a>').attr({
                        target: '_new',
                        class: 'funcButtons click-able myClass',
                        title: 'View LIVE Site'
                    }).css({
                        float: 'right'
                    }).text('LIVE'),
                    $copyFolderPath: jQuery('<div>').attr({
                        class: 'funcButtons copyFolderPath click-able',
                        title: 'Project Folder Location in Manu Folder'
                    }).css({
                        float: 'right',
                        display: 'none'
                    }),
                    $folderImage: jQuery('<i>').attr({
                        class: 'fa fa-folder-open fa-lg myClass'
                    }),
                    commentsbgColor: 'linear-gradient(to left, #FF512F , #DD2476)',
                    $importantInfo: jQuery('<div>').attr({
                        id: 'importantInfo'
                    }),
                    $BACinfo: jQuery('<div>').attr({
                        class: 'BACinfo funcButtons imp'
                    }).html('<div class="myTitle BACinfo">Dealer Code/BAC</div>'),
                    $clickMe: jQuery('<div>').attr({
                        class: 'BACinfo'
                    }).css({
                        display: 'none',
                    }),
                    $BACtable: jQuery('<div>').css({
                        display: 'none',
                        position: 'absolute',
                        'margin-top': '38px',
                        background: 'rgb(255, 255, 255)',
                        border: '1px solid rgb(0, 0, 0)',
                    }),
                    accountPage: '',
                    $dynoDisplay: jQuery('<div>').attr({
                        id: 'dynoDisplay'
                    }).css({
                        position: 'absolute',
                        left: '35%',
                        background: 'purple',
                        padding: '5px 20px',
                        top: '100%',
                        display: 'none',
                        color: 'white'
                    })
                };
            },
            cacheDOM: function () {
                // launch stuff
                this.$launchID = jQuery('#Name_ileinner').css({
                    background: 'rgb(255, 0, 0)',
                    color: 'white',
                    display: 'table'
                });
                this.launchID = this.$launchID.text();

                this.$webID = jQuery('#CF00N40000002aUF9_ileinner a').css({
                    background: 'rgb(255, 20, 155)',
                    color: 'white'
                });
                this.webID = this.$webID.text();

                this.comboID = this.webID + ' ' + this.launchID;

                this.$account = jQuery('#CF00N40000002aUDp_ileinner a').css({
                    background: 'rgb(110, 55, 215)',
                    color: 'white'
                });
                this.accountInfo = this.$account.attr('href');
                this.accountName = this.$account.text();
                this.accountID = this.accountInfo.slice(1);

                this.$webIDtext = jQuery('#00N40000002aUF8_ileinner').css({
                    background: 'rgb(180, 120, 120)',
                    color: 'white',
                    display: 'table'
                });
                this.webIDtext = this.$webIDtext.text();

                this.$webnum = jQuery('#00N40000002cgmd_ileinner').css({
                    background: 'rgb(219, 112, 147)',
                    color: 'white',
                    display: 'table'
                });
                this.webnumText = this.$webnum.text();

                this.$proofDate = jQuery('#00N330000038W91_ileinner').css({
                    background: 'rgb(0, 100, 0)',
                    color: 'white',
                    display: 'table'
                });
                this.proofDateText = this.$proofDate.text();

                this.$launchDate = jQuery('#00N33000002yrbp_ileinner').css({
                    background: 'rgb(165, 115, 50)',
                    color: 'white',
                    display: 'table'
                });
                this.launchDateText = this.$launchDate.text();
                this.owner = jQuery('#Owner_ileinner').find('[id*="Owner"]').text();
                this.$builder = jQuery('#CF00N40000002aUE2_ileinner');
                this.bizBeginning = 'j_id0_j_id5_';
                this.accountID = '';
                this.bizEnd = '_00N40000002aU57';
                this.bizSiteTable = this.bizBeginning + this.accountID + this.bizEnd;
                // case stuff
                this.path = window.location.pathname;
                this.actualLaunchID = this.path.slice(1);
                this.$body = jQuery('body');
                this.$head = jQuery('head');
                this.idArray = this.webID.split('-');
                this.oem = this.idArray[0];
                this.id = this.webID.substr(this.webID.indexOf('-') + 1);
                this.childCasesID = '#' + this.actualLaunchID + '_00N40000002aU8H_body';
                this.childCasesText = jQuery.trim(jQuery('#' + this.actualLaunchID + '_00N40000002aU8H_body').text());
                this.host = window.location.hostname;
                this.protocol = window.location.protocol;
            },
            changeTab: function () {
                launchToolbar.config.$toggleOn.html('&#9666; Launch');
                launchToolbar.config.$toggleOff.html('Launch &#9656;');
            },
            buildWSMlink: function () {
                if (-1 != this.webID.search('gmcl')) {
                    if (-1 != this.webID.search('-fr')) {
                        launchToolbar.config.wsmLink = launchToolbar.config.base + this.webID + launchToolbar.config.fr_ca;
                    } else {
                        launchToolbar.config.wsmLink = launchToolbar.config.base + this.webID + launchToolbar.config.en_ca;
                    }
                } else if (-1 != this.webID.search('holden')) {
                    if (-1 != this.webID.search('holdennz')) {
                        launchToolbar.config.wsmLink = launchToolbar.config.base + this.webID + launchToolbar.config.nz;
                    } else {
                        launchToolbar.config.wsmLink = launchToolbar.config.base + this.webID + launchToolbar.config.au;
                    }
                } else {
                    launchToolbar.config.wsmLink = launchToolbar.config.base + this.webID + launchToolbar.config.us;
                }
            },
            caseCheck: function () {
                if (this.childCasesText !== 'No records to display') {
                    console.log('cases made');
                    jQuery('.ptBody .content').append(launchToolbar.config.$casesMade);

                    jQuery('listHoverLinks').on('load', setTimeout(this.colorRelatedCases.bind(this), 2000));
                }
                console.log('no cases made');
            },
            buildFolderPath: function () {
                var oem = this.oem,
                    oemPart;
                switch (this.oem) {
                    case 'gmps':
                        oemPart = 'gmpsdealer.com/';
                        break;
                    case 'gmcl':
                        oemPart = 'gmcldealer.com/';
                        break;
                    case 'vw':
                        oemPart = 'vwdealer.com/';
                        break;
                    case 'hyun':
                        oemPart = 'hyundaistores.com/';
                        break;
                    case 'mazda':
                        oemPart = 'mazdadealer.com/';
                        break;
                    case 'lex':
                        oemPart = 'lexusdealer.com/';
                        oem = 'lexus\\';
                        break;
                    case 'k1ia':
                        oemPart = 'k1iadealer.com/';
                        break;
                    case 'b2mw':
                        oemPart = 'b2mwdealer.com/';
                        break;
                    case 'mini':
                        oemPart = 'mini-dealer.com/';
                        break;
                    case 'motp':
                        oemPart = 'motorplace.com/';
                        oem = 'motorplace\\';
                        break;
                    case 'hond':
                        oemPart = 'hondadealer.com/';
                        oem = 'honda\\';
                        break;
                    case 'holden':
                        oemPart = 'gmholdendealer.com.au/';
                        break;
                    case 'holdennz':
                        oemPart = 'gmholdendealer.co.nz/';
                        break;
                    case 'nissan':
                        oemPart = 'nissandealer.com/';
                        break;
                    case 'toyd':
                        oemPart = 'toyotadealer.com/';
                        oem = 'toyota\\';
                        break;
                    case 'infiniti':
                        oemPart = 'infiniti.dealer.com/';
                        break;
                }
                launchToolbar.config.wipSiteURL = launchToolbar.config.nitra + oemPart + this.id + launchToolbar.config.reload;
                launchToolbar.config.proofSiteURL = launchToolbar.config.nitra + oemPart + this.id + launchToolbar.config.reload;
                launchToolbar.config.liveSiteURL = launchToolbar.config.nitra + oemPart + this.id + launchToolbar.config.reload;
                launchToolbar.config.folderPath = launchToolbar.config.baseManuLoc + oem + '\\' + this.id.charAt(0) + '\\' + this.id;
            },
            openAccountInfoPage: function () {
                var openThis = this.protocol + '//' + this.host + '' + this.accountInfo;
                launchToolbar.config.accountPage = openInTab(openThis);
            },
            bindEvents: function () {
                launchToolbar.config.$toggleOn.on('click', this.animate);
                launchToolbar.config.$toggleOn.on('click', this.toggleBox);
                launchToolbar.config.$toggleOff.on('click', this.animate);
                launchToolbar.config.$toggleOff.on('click', this.toggleBox);
                launchToolbar.config.$idCombo.on('click', this.clipboardCopy.bind(this));
                launchToolbar.config.$launchID.on('click', this.clipboardCopy.bind(this));
                launchToolbar.config.$copyWebID.on('click', this.clipboardCopy.bind(this));
                launchToolbar.config.$accountName.on('click', this.clipboardCopy.bind(this));
                launchToolbar.config.$copyFolderPath.on('click', this.clipboardCopy.bind(this));
                launchToolbar.config.$webIDtext.on('click', this.clipboardCopy.bind(this));
                launchToolbar.config.$BACinfo.on('click', this.toggleThis.bind(this));
            },
            toggleThis: function (event) {
                var $event = jQuery(event.target),
                    classText = $event.attr('class');
                console.log('$event');
                console.log($event);
                console.log('class : ' + classText);
                switch (classText) {
                    case 'BACinfo':
                        launchToolbar.config.$BACtable.toggle(1000);
                        break;
                }
            },
            addStyles: function () {
                launchToolbar.config.$toolbarStyles
                    // general toolbox styles
                    .append('.funcButtons { display: none; padding: 3px 15px 0; border-right: 1px rgb(112, 160, 121) solid; padding-top: 0px; } ')
                    .append('.click-able { cursor: pointer; } ')
                    .append('.myTitle { color: #000000; } ')
                    .append('.myClass { line-height: 30px;  height: 30px; } ')
                    .append('.myClass:hover { font-weight: bold; } ')
                    .append('.imp { float: left !important; } '); // end
            },
            buildTool: function () {
                launchToolbar.config.$accountName.append(this.accountName);
                launchToolbar.config.$EditLink.attr({
                    href: launchToolbar.config.wsmLink
                });
                launchToolbar.config.$idCombo.append(launchToolbar.config.$plusIcon);

                launchToolbar.config.$wipSite.attr({
                    href: launchToolbar.config.wipSiteURL
                });
                launchToolbar.config.$proofSite.attr({
                    href: launchToolbar.config.proofSiteURL
                });
                launchToolbar.config.$liveSite.attr({
                    href: launchToolbar.config.liveSiteURL
                });
                launchToolbar.config.$copyFolderPath.append(launchToolbar.config.$folderImage);
                launchToolbar.config.$launchID.append(this.launchID);
                launchToolbar.config.$copyWebID.append(this.webID);
                launchToolbar.config.$webnum.append(this.webnumText);
                launchToolbar.config.$proofDate.append(this.proofDateText);
                launchToolbar.config.$launchDate.append(this.launchDateText);
                launchToolbar.config.$webIDtext.append(this.webIDtext);
                launchToolbar.config.$BACinfo.append(launchToolbar.config.$clickMe);
                launchToolbar.config.$uiBox.append(launchToolbar.config.$toggleOn)
                    .append(launchToolbar.config.$toggleOff)
                    .append(launchToolbar.config.$webIDtext)
                    .append(launchToolbar.config.$accountName)
                    .append(launchToolbar.config.$EditLink)
                    .append(launchToolbar.config.$launchID)
                    .append(launchToolbar.config.$copyWebID)
                    .append(launchToolbar.config.$webnum)
                    .append(launchToolbar.config.$proofDate)
                    .append(launchToolbar.config.$launchDate)
                    .append(launchToolbar.config.$wipSite)
                    .append(launchToolbar.config.$proofSite)
                    .append(launchToolbar.config.$liveSite)
                    .append(launchToolbar.config.$copyFolderPath)
                    .append(launchToolbar.config.$idCombo)
                    .append(launchToolbar.config.$importantInfo)
                    .append(launchToolbar.config.$dynoDisplay)
                    .append(launchToolbar.config.$BACinfo)
                    .append(launchToolbar.config.$BACtable);
            },
            attachTool: function () {
                this.$head.append(launchToolbar.config.$toolbarStyles);
                this.$head.append(launchToolbar.config.$jQueryLink);
                this.$head.append(launchToolbar.config.$montFontLink);
                this.$body.prepend(launchToolbar.config.$placeholder);
                this.$body.prepend(launchToolbar.config.$uiBox);
            },
            startTool: function () {
                var commentsID = this.commentsID;
                setTimeout(function (commentsID) {
                    jQuery(commentsID).css({
                        background: launchToolbar.config.commentsbgColor,
                        color: '#ccc'
                    });
                    launchToolbar.config.$toggleOn.trigger('click');
                }, 2000);
            },
            BACtable: function () {
                var BACvariable = 'BSCtable',
                    accountName = getValue('accountName');

                if (getValue(BACvariable) === undefined) {
                    // if table is empty
                    this.BACtable();
                } else {
                    // if table is not empty
                    console.log('content loaded');
                    setTimeout(function () {
                        launchToolbar.config.$BACtable.html(getValue(BACvariable));
                        setTimeout(function () {
                            launchToolbar.config.$clickMe.text('Click for ' + accountName + ' Info');
                            launchToolbar.config.$clickMe.toggle(500);
                        });
                    }, 7000);
                }

            },
            // ----------------------------------------
            // TIER 2
            // ----------------------------------------
            colorRelatedCases: function () {
                var _cases = '_00N40000002aU8H_link',
                    $caseLink = jQuery('#' + this.actualLaunchID + '' + _cases);
                $caseLink.css({
                    background: 'linear-gradient(to left, rgb(130, 40, 90), rgb(100, 30, 75))',
                    color: '#ccc'
                });
            },
            animate: function () {
                var $funcButts = jQuery('.funcButtons');
                launchToolbar.config.$toggleOn.toggle();
                launchToolbar.config.$toggleOff.toggle();
                $funcButts.toggle();
            },
            toggleBox: function () {
                launchToolbar.config.$placeholder.slideToggle("slow");
                launchToolbar.config.$uiBox.slideToggle("slow", function () {
                    if (jQuery(this).is(':visible')) {
                        jQuery(this).css({
                            display: 'inline-block'
                        });
                    }
                });
            },
            showBox: function () {
                launchToolbar.config.$uiBox.slideToggle("slow", function () {
                    if (jQuery(this).is(':visible')) {
                        jQuery(this).css({
                            display: 'inline-block'
                        });
                    }
                });
            },
            hideBox: function () {
                launchToolbar.config.$uiBox.animate({
                    width: "150px"
                }, "slow");
            },
            clipboardCopy: function (event) {
                var $clickedElement = jQuery(event.delegateTarget),
                    classText = $clickedElement.attr('class');

                switch (true) {
                    case (classText.indexOf('idCombo') === 0):
                        console.log('idCombo');
                        this.copyInfo(this.comboID);
                        break;
                    case (classText.indexOf('launchID') === 0):
                        console.log('launchID');
                        this.copyInfo(this.launchID);
                        break;
                    case (classText.indexOf('copyWebid') === 0):
                        console.log('copyWebid');
                        this.copyInfo(this.webID);
                        break;
                    case (classText.indexOf('accountName') === 0):
                        console.log('accountName');
                        this.copyInfo(this.accountName);
                        break;
                    case (classText.indexOf('copyFolderPath') === 0):
                        console.log('copyFolderPath');
                        this.copyInfo(launchToolbar.config.folderPath);
                        break;
                    case (classText.indexOf('webIDtext') === 0):
                        console.log('webIDtext');
                        this.copyInfo(this.webIDtext);
                        break;
                    default:
                        console.log('nothing copied');
                }
            },
            // ----------------------------------------
            // tier 3
            // ----------------------------------------
            copyInfo: function (variable) {
                var $display = jQuery('<div>').css({
                    display: 'none'
                });
                GM_setClipboard(variable, 'text');
                $display.text('COPIED ' + variable);
                launchToolbar.config.$dynoDisplay.toggle().append($display);
                $display.slideToggle(500).delay(3000).slideToggle(500, function () {
                    $display.remove();
                    launchToolbar.config.$dynoDisplay.toggle();
                });
            }
        },
        getBAC = {
            init: function () {
                this.getBAC();
            },
            getBAC: function () {

                jQuery(document).ready(function () {
                    var beginning = 'j_id0_j_id5_',
                        end = '_00N40000002aU57',
                        location = window.location.href,
                        body = '_body',
                        findID = 'id=',
                        BACvariable = 'BSCtable',
                        accountNameText = jQuery('#acc2j_id0_j_id5_ileinner').text(),
                        accountID, tableID, tableBody, startLocation, endLocation, $BACbody, accountName;

                    //                console.log('sliced : "' + jQuery.trim(accountNameText.slice(0, accountNameText.indexOf('['))) + '"');

                    accountName = jQuery.trim(accountNameText.slice(0, accountNameText.indexOf('[')));

                    // search url for account id
                    startLocation = location.indexOf(findID) + findID.length;
                    endLocation = location.indexOf('&');
                    accountID = location.slice(startLocation, endLocation);
                    tableID = '#' + beginning + '' + accountID + '' + end;
                    console.log(getValue(BACvariable));

                    console.log('accountNameText : ' + accountNameText);

                    setTimeout(function () {
                        while (getValue(BACvariable) === undefined || getValue(BACvariable) === false) {

                            console.log('accountName : ' + accountName);

                            tableBody = tableID + body;
                            $BACbody = jQuery(tableBody);
                            setValue(BACvariable, $BACbody.html());
                            setValue('accountName', accountName);

                        }
                    }, 5000);
                });

                //            window.close();
            },
            checkFocus: function () {
                var window_focus = false;

                setInterval(function () {
                    jQuery(window).focus(function () {
                        window_focus = true;
                    }).blur(function () {
                        window_focus = false;
                    });
                    //                            jQuery('body').append('has focus? ' + window_focus + '<br>');
                    console.log('focused : ' + window_focus);
                }, 2000);
            }
        };


    if (window.location.hostname === 'cdk.my.salesforce.com') {
        console.log('fire');
        launchToolbar.init();
    }

    if (window.location.hostname === 'cdk--c.na27.visual.force.com') {
        //            var $getData = jQuery('<script>').attr({
        //                type: 'text/javascript',
        //                src: 'https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js'
        //            });
        getBAC.init();
    }

})();
