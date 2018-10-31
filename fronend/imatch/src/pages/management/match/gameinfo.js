import React from 'react'
import router from 'umi/router';
import Listgameinfo from '@/component/Listgameinfo'
import { connect } from 'dva';


class gameView extends React.Component {
    componentWillMount() {
        // this.setState({
            // key: location.search.split('=')[1]
        // })
    }
    state = {
        key: ''
    }
    render() {
        const dataSource = this.props.games.dataSource
        let detailData = {}
        dataSource.map(item => {
            item['key'] === this.state.key ? detailData = item : null
        })

        return (
            <div>
                <Listgameinfo detailData={detailData} />

            </div>
        )
    }
}

export default connect(({ games }) => ({ games }))(gameView)







