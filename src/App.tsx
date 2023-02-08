import React, { CSSProperties, createContext } from 'react';
import './App.css';
import { CATEGORIES, ThemeContext, ThemeContextType } from './constants';
import { data } from './Data';
import CategoryView from './views/category/CategoryView';

interface Props { }
interface State {
    lastUpdateDate: Date | null
    gainerList: any[]
    loserList: any[]
    selectedCategoryIndex: number
    isLoading: boolean
    nextFetchDate: Date
    mode: ThemeContextType
}

const NEXT_LOAD_MILLISECONDS = 6000

const baseOuterFrameStyle: CSSProperties = {
    height: '100%',
    overflowX: 'scroll'
}
const outerFrameStyleDark: CSSProperties = {
    backgroundColor: '#333',
}
const outerFrameStyleLight: CSSProperties = {
    backgroundColor: 'white'
}
const frameStyle: CSSProperties = {
    display: 'flex',
    // justifyContent: 'center',
    alignItems: 'center',
    minWidth: '375px',
    maxWidth: '600px',
    // height: '100%',
    margin: '0 auto',
    flexDirection: 'column',
    padding: '8px'
}

const baseHeadStyle: CSSProperties = {
    width: '100%',
    height: '50px',
    backgroundColor: '#eee',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px'
}
const headStyleLight: CSSProperties = {
    border: '1px solid black'
}
const headStyleDark: CSSProperties = {
    border: '1px solid white'
}
const headSelectStyle: CSSProperties = {
    marginLeft: '8px'
}
const modeButtonStyle: CSSProperties = {
    marginRight: '8px'
}
const baseContentStyle: CSSProperties = {
    width: '100%',
    minHeight: `${667 - 50}px`,
    backgroundColor: '#ccc',
    borderBottomLeftRadius: '8px',
    borderBottomRightRadius: '8px'
}
const contentStyleLight: CSSProperties = {
    borderTop: 'transparent',
    borderBottom: '1px solid black',
    borderLeft: '1px solid black',
    borderRight: '1px solid black'
}
const contentStyleDark: CSSProperties = {
    borderTop: 'transparent',
    borderBottom: '1px solid white',
    borderLeft: '1px solid white',
    borderRight: '1px solid white'
}

export default class App extends React.Component<Props, State> {
    constructor(p: Props) {
        super(p)

        let mode = localStorage.getItem('mode') as ThemeContextType
        if (!mode)
            mode = 'light'
        const obj = data.getDataFor(0)
        this.state = {
            lastUpdateDate: obj ? obj.loadDate : null,
            gainerList: obj ? obj.gainersList : [],
            loserList: obj ? obj?.losersList : [],
            selectedCategoryIndex: 0,
            isLoading: false,
            nextFetchDate: new Date(),
            mode: mode
        }
    }

    _renderCategoryOptions = () => {
        return CATEGORIES.map((e, index) => {
            return <option key={index}>{e.name}</option>
        })
    }

    _onChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCategoryIndex = e.target.selectedIndex;
        const obj = data.getDataFor(selectedCategoryIndex)
        this.setState({
            ...this.state,
            selectedCategoryIndex,
            lastUpdateDate: obj ? obj.loadDate : null,
            gainerList: obj ? obj.gainersList : [],
            loserList: obj ? obj.losersList : []
        })
    }

    _fetchData = () => {
        console.log('fetch data')
        this.setState({ ...this.state, isLoading: true })
        const selectedCategoryID = CATEGORIES[this.state.selectedCategoryIndex].category_id
        const categoryID = selectedCategoryID === '' ? undefined : selectedCategoryID;
        data.fetchData(categoryID).then(() => {
            console.log('fetch data done')
            let obj = data.getDataFor(this.state.selectedCategoryIndex)
            this.setState({
                ...this.state,
                lastUpdateDate: obj ? obj.loadDate : null,
                gainerList: obj ? obj.gainersList : [],
                loserList: obj ? obj.losersList : [],
                isLoading: false,
                nextFetchDate: new Date(Date.now() + NEXT_LOAD_MILLISECONDS)
            })
        }).catch((e) => {
            alert(e.message)
            this.setState({ ...this.state, isLoading: false })
        })
    }
    _exportCSV = () => {
        // const { lastUpdateDate, gainerList, loserList } = this.state
        // if (lastUpdateDate)
        // data.exportCSV(lastUpdateDate, gainerList, loserList)
        data.exportCSVFor(this.state.selectedCategoryIndex)
    }

    _toggleMode = () => {
        const targetMode = this.state.mode === 'light' ? 'dark' : 'light'
        this.setState({
            ...this.state,
            mode: targetMode
        })
        localStorage.setItem('mode', targetMode)
    }

    _handleMode() {
        if (this.state.mode === 'light')
            return {
                headStyle: { ...baseHeadStyle, ...headStyleLight },
                contentStyle: { ...baseContentStyle, ...contentStyleLight },
                outerFrameStyle: { ...baseOuterFrameStyle, ...outerFrameStyleLight }
            }
        return {
            headStyle: { ...baseHeadStyle, ...headStyleDark },
            contentStyle: { ...baseContentStyle, ...contentStyleDark },
            outerFrameStyle: { ...baseOuterFrameStyle, ...outerFrameStyleDark }
        }
    }

    render(): React.ReactNode {
        const { outerFrameStyle, contentStyle, headStyle } = this._handleMode()
        return <ThemeContext.Provider value={this.state.mode}>
            <div id="outerframe" style={outerFrameStyle}>
                <div id='frame' style={frameStyle}>
                    <div id="head" style={headStyle}>
                        {/* <p style={headTitleStyle}>{CATEGORIES[this.state.selectedCategoryIndex].name}</p> */}
                        <select onChange={this._onChangeCategory} style={headSelectStyle}>
                            {this._renderCategoryOptions()}
                        </select>
                        <button onClick={this._toggleMode} style={modeButtonStyle}>{this.state.mode}</button>
                    </div>
                    <div id='content' style={contentStyle}>
                        <CategoryView
                            onClickExport={this._exportCSV}
                            onClickFetch={this._fetchData}
                            lastUpdate={this.state.lastUpdateDate}
                            gainersList={this.state.gainerList}
                            loserList={this.state.loserList}
                            isLoading={this.state.isLoading}
                            nextFetchDate={this.state.nextFetchDate} />
                    </div>
                </div>

            </div>
        </ThemeContext.Provider>
    }
}

