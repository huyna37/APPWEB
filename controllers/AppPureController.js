const { default: axios } = require("axios");
const { Cheerio } = require("cheerio");
exports.get = async (req, res) => {
    try {
        const responseApp = await axios.get("https://apkpure.com/vn/app");
        if (responseApp) {
            const cherryApp = Cheerio.load(responseApp.data);
            const categories = cherryApp('body > main > div:nth-child(11) > div.apk-name-list > a:nth-child(1)').map(
                value => {
                    const href = value.attr('href');
                    return href;
                }
            );
            if (!categories) {
                return "Not Found categories";
            }


        }
        return res.status(200).json({
            status: true,
            result,
        });
    }
    catch (ex) {
        console.error("Error crawling data:", error);
        res.status(200).json({
            status: false,
        });
    }

}