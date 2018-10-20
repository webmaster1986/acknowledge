import React from 'react';
import {Row, Col, Icon, Modal} from 'antd'
import ProfileModel from './ProfileModel'

class MyAccount extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      editModelShow: false,
    };
    this.handleCancel = this.handleCancel.bind(this);
  }

  isEditModel(){
    this.setState({
      editModelShow: true
    })
  }

  handleCancel(isReFetch) {
    this.setState({
      editModelShow: false,
    });
    if (isReFetch) {
      this.props.getAccount();
    }
  }

  render() {
    const { editModelShow } = this.state;
    const userDetails = this.props.profileInfo || {}
    const isProfileSet = localStorage.getItem('profile_firstTime_Added')
    return (
      <div className="block_locker">
        <div className="col-md-12 col-sm-12 col-xs-12 block_image account-pg">
            <Row gutter={8}>
              <Col span={21}>
                  {isProfileSet ?
                      <div className="profile-container">
                          <div className="row">
                              <div className="col-md-11 col-sm-11 col-xs-9">
                                  <div className="profile-name">
                                      <h3>{userDetails.firstName} &nbsp; {userDetails.lastName}&nbsp;&nbsp;</h3>
                                  </div>
                                  <div className="profile-premioum">
                                    {userDetails.isPremiumUser && <p>Preminm User&nbsp;&nbsp;</p>}
                                  </div>
                              </div>
                              <div className="col-md-1 col-sm-3 col-xs-3">
                                  <Icon type="ellipsis"
                                        onClick={() => this.isEditModel()}
                                        className="cursor menu-icon"
                                        theme="outlined"/>
                              </div>
                          </div>
                          <div className="row col-md-12 col-sm-12 col-xs-12">
                              {
                                  userDetails.currentWorkTitle ?
                                      <div className="profile-worktitle">
                                        {userDetails.currentWorkTitle ? <b>{userDetails.currentWorkTitle}&nbsp;&nbsp;</b> : null}
                                      </div> : null
                              }
                          </div>
                          <div className="row col-md-12 col-sm-12 col-xs-12">
                              {
                                  userDetails.mostRecentFieldOfStudy &&
                                      <div className="profile-details">
                                        {userDetails.mostRecentFieldOfStudy ? <p>•&nbsp;{userDetails.mostRecentFieldOfStudy} &nbsp;&nbsp;</p> : null}
                                      </div>
                              }


                              {
                                userDetails.mostRecentCollegeOrUniversity &&
                                  <div className="profile-details">
                                    {userDetails.mostRecentCollegeOrUniversity ? <p>•&nbsp;{userDetails.mostRecentCollegeOrUniversity} &nbsp;&nbsp;</p> : null}
                                  </div>
                              }

                              {
                                (userDetails.city || userDetails.country) &&
                                      <div className="profile-details">
                                          <p>{userDetails.city ? <span>•&nbsp;{userDetails.city},</span> : null}
                                            {userDetails.country ? <span>&nbsp;{userDetails && userDetails.country} &nbsp;&nbsp;</span> : null}</p>
                                      </div>
                              }
                          </div>
                          <div className="row col-md-12 col-sm-12 col-xs-12">

                              {
                                  userDetails.email &&
                                      <div className="profile-details">
                                          <p>•&nbsp;{userDetails.email} &nbsp;&nbsp;</p>
                                      </div>
                              }

                              {
                                  userDetails.mobile &&
                                      <div className="profile-details">
                                        {userDetails.mobile ? <p>•&nbsp;{userDetails.mobile} &nbsp;&nbsp;</p> : null}
                                      </div>
                              }

                          </div>
                          <div className="user-details">
                              {
                                userDetails.facebookURL ?
                                  <div className="icons">
                                    <a href={userDetails.facebookURL} target="_blank">
                                      <i className="fa fa-facebook-square fb-icon"/>
                                    </a>
                                  </div> : null
                              }
                              {
                                userDetails.linkedInProfileURL ?
                                  <div className="icons">
                                    <a href={userDetails.linkedInProfileURL} target="_blank" >
                                      <i  className="fa fa-linkedin-square li-icon"/>
                                    </a>
                                  </div> : null
                              }

                              {
                                userDetails.twitterHandle ?
                                  <div className="icons">
                                    <a href={userDetails.twitterHandle} target="_blank" >
                                      <i className="fa fa-twitter-square twit-icon"/>
                                    </a>
                                  </div> : null
                              }

                              {
                                userDetails.githubURL ?
                                  <div className="icons">
                                    <a href={userDetails.githubURL} target="_blank" >
                                      <i className="fa fa-github-square git-icon"/>
                                    </a>
                                  </div>: null
                              }
                          </div>

                         <Modal
                              title="Edit Profile"
                              okText="Save"
                              cancelText="Cancel"
                              width={800}
                              visible={editModelShow}
                              onCancel={this.handleCancel} footer={null}>
                              <ProfileModel getData={this.getData} onSave={this.handleCancel}/>
                          </Modal>
                      </div> :
                      <ProfileModel getData={this.getData} onSave={this.handleCancel}/>
                  }
              </Col>
            </Row>
          </div>
        </div>
    )
  }
}

export default MyAccount;
