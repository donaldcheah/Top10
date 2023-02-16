import { CATEGORIES } from "./constants"
import { json2csvAsync } from "json-2-csv"

const PER_PAGE = 250
const PAGES = 4

const GAINERS_KEY = "_gainers"
const LOSERS_KEY = "_losers"
const DATE_KEY = "_time"

type TopData = {
    gainersList: any[]
    losersList: any[]
    loadDate: Date
};
class Data {

    //perPage 1..250
    private _getApiLink(perPage: number, page: number, categoryID?: string) {
        if (perPage < 1 || perPage > 250)
            throw new Error('Invalid perPage, only accept 1..250.')

        let link = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false&price_change_percentage=7d`

        if (categoryID) {
            link = link.concat(`&category=${categoryID}`)
        }

        return link
    }

    /* takes retrieved data and only keep several fields */
    private _shaveRawData(rawData: any[]) {
        return rawData.map((e) => {
            const { name, symbol, current_price, price_change_percentage_7d_in_currency } = e;
            return {
                name, symbol, current_price, price_change_percentage_7d_in_currency
            }
        })
    }

    exportCSVFor(categoryIndex: number) {
        const data = this.getDataFor(categoryIndex)
        if (!data)
            return
        const { loadDate, gainersList, losersList } = data
        const list = gainersList.concat(losersList.reverse()).map((e) => {
            e['date'] = loadDate.toLocaleString()
            e['category'] = CATEGORIES[categoryIndex].name
            return e
        })
        console.log('exportCSV : ', list)
        const categoryName = CATEGORIES[categoryIndex].name
        json2csvAsync(list).then((str) => {
            this._processDownload(str, categoryName, loadDate)
        })


    }
    private _processDownload(csvString: string, categroyName: string, dataDate: Date) {

        const offset = dataDate.getTimezoneOffset();
        const date = new Date(dataDate.getTime() - offset * 60 * 1000);
        const dateTimeString = date.toISOString().replace(/[^0-9]/g, '').substr(0, 14);

        const fileName = `Top10_${categroyName}_${dateTimeString}.csv`
        const fileType = "text/csv"
        this.downloadFile(fileName, csvString, fileType)
    }

    private downloadFile(fileName: string, fileString: string, fileType: string) {
        var a = document.createElement("a");
        var file = new Blob([fileString], { type: fileType });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }

    getDataFor(categoryIndex: number): TopData | null {
        const categoryName = CATEGORIES[categoryIndex].name
        const strGainers = localStorage.getItem(`${categoryName}${GAINERS_KEY}`)
        const strLosers = localStorage.getItem(`${categoryName}${LOSERS_KEY}`)
        const strDate = localStorage.getItem(`${categoryName}${DATE_KEY}`)
        if (!strGainers || !strLosers || !strDate) {
            return null
        }
        const gainersList = JSON.parse(strGainers)
        const losersList = JSON.parse(strLosers)
        const loadDate = new Date(strDate)
        return {
            gainersList, losersList, loadDate
        }
    }

    fetchData = (categoryID?: string): Promise<void> => {
        const promises = []
        for (let i = 1; i <= PAGES; i++) {
            promises.push(fetch(this._getApiLink(PER_PAGE, i, categoryID)).then(res => res.json()))
        }

        let categoryName: string = CATEGORIES[0].name

        const obj = CATEGORIES.find((e) => {
            return e.category_id === categoryID
        })
        if (obj)
            categoryName = obj.name

        return Promise.all<any[][]>(promises).then((arrs) => {
            console.log('fetchData arrs : ', arrs)
            const rawData = this._shaveRawData(arrs.flat())
            console.log('raw=', rawData)
            const sortedDesc = rawData.filter((e) => {
                return e.price_change_percentage_7d_in_currency !== null && e.price_change_percentage_7d_in_currency !== 0
            }).sort((a, b) => {
                return b.price_change_percentage_7d_in_currency - a.price_change_percentage_7d_in_currency
            })
            const gainers = sortedDesc.slice(0, 10).filter((e) => { return e.price_change_percentage_7d_in_currency > 0 })
            const losers = sortedDesc.slice(-10).reverse().filter((e) => { return e.price_change_percentage_7d_in_currency < 0 })
            const selectedCategory = categoryName ? categoryName : 'all'
            const gainersKey = `${selectedCategory}_gainers`
            const losersKey = `${selectedCategory}_losers`
            const timeKey = `${selectedCategory}_time`
            localStorage.setItem(gainersKey, JSON.stringify(gainers))
            localStorage.setItem(losersKey, JSON.stringify(losers))
            localStorage.setItem(timeKey, new Date().toISOString())
        })
    }


}
const data: Data = new Data()
export { data }