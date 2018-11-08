import React, { Component } from 'react';
import { Table } from 'antd';
import { connect } from 'dva';
import { lookup } from '@/utils/tools'

class TeamMatch extends Component {
  state = {
    TeamRoundInfoData: []
  }
  componentDidMount() {
    const {
      dispatch,
      location: { query: { team_id } },
    } = this.props;
    dispatch({
      type: 'ogTeam/read',
      payload: { id: parseInt(team_id) }
    }).then(() => {
      const { odooData: { ogTeam } } = this.props;
      const TeamData = lookup(team_id, ogTeam);
      const round_info_ids = TeamData[0].round_info_ids;
      dispatch({
        type: "ogTeamRoundInfo/read",
        payload: { id: round_info_ids }
      }).then(() => {
        const { odooData: { ogTeamRoundInfo } } = this.props;
        const TeamRoundInfoData = lookup(round_info_ids, ogTeamRoundInfo);
        this.setState({
          TeamRoundInfoData: TeamRoundInfoData,
        })
      })
    })
  }
  render() {
    const { TeamRoundInfoData } = this.state;
    const TeamMatchColumns = [
      {
        title: '轮次',
        dataIndex: 'round_id',
        render: (text, record) => {
          return `${record.round_id[0]}`
        }
      }, {
        title: '对阵方',
        dataIndex: 'opp_team_id',
        render: (text, record) => {
          return `${record.opp_team_id[1]}`
        }
      }, {
        title: 'IMPs',
        children: [{
          title: TeamRoundInfoData.length > 0 ? `${TeamRoundInfoData[0].team_id[1]}` : '',
          dataIndex: 'imp'
        }, {
          title: '对手',
          dataIndex: 'imp_opp',
        }],
      }, {
        title: 'VPs',
        children: [{
          title: TeamRoundInfoData.length > 0 ? `${TeamRoundInfoData[0].team_id[1]}` : '',
          dataIndex: 'vp',
        }, {
          title: '对手',
          dataIndex: 'vp_opp',
        }],
      }, {
        title: '总分',
        dataIndex: 'score'
      }
    ]
    return (
      <div>
        <div><h2>石家庄</h2></div>
        <Table
          rowKey={row => row.id}
          columns={TeamMatchColumns}
          dataSource={TeamRoundInfoData}
          pagination
        />
      </div>
    )
  }
}

export default connect(({ odooData, ogTeam }) => ({ odooData, ogTeam }))(TeamMatch);