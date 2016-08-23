import moment from 'moment';

moment().format();

moment.updateLocale('en', {
    relativeTime : {
        future: "后 %s",
        past:   "%s前",
        s:  "秒",
        m:  "1分钟",
        mm: "%d 分钟",
        h:  "1小时",
        hh: "%d小时",
        d:  "1天",
        dd: "%d天",
        M:  "1月",
        MM: "%d月",
        y:  "1年",
        yy: "%d年"
    }
});

export default moment;