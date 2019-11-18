var LottoTools = (function() {
    var _Self;
    var _arrLottoNum = [];

    return {
        GetLottoInfo: function() {
            var CaseInfo = $('.date-info');
            if (CaseInfo == null)
                return false;

            // 회차 정보 가져와서
            var sCaseNum = CaseInfo.children('h3').children('strong').text().replace(/[^0-9]/g, "");
            if (sCaseNum == '')
                return false;

            // 해당 회차의 당첨 번호를 가져와서 저장한 뒤
            var jqxhr = $.ajax({
                    url: 'https://www.dhlottery.co.kr/common.do', // 현재 동행로또 주소
                    data: { method: 'getLottoNumber', drwNo: sCaseNum },
                    method: 'GET',
                    dataType: 'json',
                    async: false
                })
                .done(function(json) {
                    if (json['returnValue'] != 'success')
                        return;

                    _arrLottoNum.push(json['drwtNo1']);
                    _arrLottoNum.push(json['drwtNo2']);
                    _arrLottoNum.push(json['drwtNo3']);
                    _arrLottoNum.push(json['drwtNo4']);
                    _arrLottoNum.push(json['drwtNo5']);
                    _arrLottoNum.push(json['drwtNo6']);
                });
            // .fail(function() { 
            // }) 
            // .always(function() { 
            // });

            if (_arrLottoNum.length != 6)
                return false;

            // 화면에 표시 해준다.
            var sAppendHtm = '<br><div class="drwtNoAll"><span>당첨  번호 : </sapn>';
            for (var i = 0; i < 6; i++) {
                sAppendHtm += '<span><strong style="padding-left:18px">' + _arrLottoNum[i] + '</strong></span>';
            }
            sAppendHtm += '</div>';
            CaseInfo.append(sAppendHtm);

            return true;
        },

        CheckLottoNum: function() {
            if (_arrLottoNum.length != 6)
                return false;

            var arrCheckNum = [];
            for (var i = 0; i < _arrLottoNum.length; i++)
                arrCheckNum.push('^' + _arrLottoNum[i] + '$');
            var rxCheckNum = new RegExp("(" + arrCheckNum.join('|') + ")");

            $('.selected').each(function() {
                var elNums = $(this).find('div.nums');
                elNums.children('span').each(function() {
                    var sNumHtm = $(this).text();
                    sNumHtm = sNumHtm.replace(rxCheckNum,
                        `<strong style="
                            color: #f00;
                            font-weight: bold;
                            background-color:#ffff00;
                            width: 14px;
                            text-align: center;

                            display: block; 
                            height: 28px; line-height: 24px;
                            font-size: 14px; padding: 0 8px; border-radius: 20px; 
                        ">$1</strong>`);
                    $(this).html(sNumHtm);
                });
            });
        },

        ProcessLottoInfo: function() {
            _Self = this;

            // if (_Self.GetLottoInfo())
            // _Self.CheckLottoNum();            

            // 몇개월 전부터 나눔로또에서 당첨 번호 하이라이트를 지원해서 당첨번호만 표시해준다. 19_1118
            _Self.GetLottoInfo();
        }
    }
})();

LottoTools.ProcessLottoInfo();