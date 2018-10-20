import React from 'react';
import BaseUrl from '../config/properties';
import axios from "axios";
import {Modal, Row, Col, Button} from 'antd'

class ProfileModel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userInfo: [],
            editModelShow: false,
            lastName: '',
            mobile: '',
            currentWorkTitle: '',
            mostRecentFieldOfStudy: '',
            country: '',
            city: '',
            twitterHandle: '',
            githubURL: '',
            linkedInProfileURL: '',
            facebookURL: '',
            profilePicture: '',
            mostRecentCollegeOrUniversity:'',
            careerStage:'',
            currentCompany:''
        };
        this.handleOk = this.handleOk.bind(this);
    }

    onChange(e) {
        const file = e.target.files && e.target.files[0];

        if (file) {
            let reader = new FileReader();
            reader.onloadend = () => {
                this.setState({
                    file: file,
                    profilePicture: reader.result
                });
            }
            reader.readAsDataURL(file)
        } else {
            this.setState({
                [e.target.name]: e.target.value
            })
        }
    }

    componentWillMount() {
        if (localStorage.getItem("userData")) {
          let userData = JSON.parse(localStorage.getItem("userData"));
          this.setState({
            userInfo: userData
          })
        }
        const config = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('authToken')
            }
        }
        axios.get(BaseUrl.base_url + "/api/v1/user/profile", config).then((response) => {
          const profileInfo = {};
          if (response.data) {
            Object.keys(response.data).forEach(key => {
              profileInfo[key] = response.data[key] !== "null" ? response.data[key] : ''
            })
          }
            this.setState({
                ...profileInfo
            })
        }).catch((error) => {
            this.setState({error: error.message})
        });
    }

    handleOk() {
        const {
            mobile, currentWorkTitle, mostRecentFieldOfStudy, country, city, currentCompany, twitterHandle,
            githubURL, linkedInProfileURL, careerStage, facebookURL, mostRecentCollegeOrUniversity
        } = this.state;

        let EditUser = {
          city: city,
          country: country,
          mobile: mobile,
          careerStage: careerStage,
          mostRecentCollegeOrUniversity: mostRecentCollegeOrUniversity,
          mostRecentFieldOfStudy: mostRecentFieldOfStudy,
          currentWorkTitle: currentWorkTitle,
          facebookURL: facebookURL,
          githubURL: githubURL,
          linkedInProfileURL: linkedInProfileURL,
          twitterHandle: twitterHandle,
          currentCompany: currentCompany,
        }
        const config = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('authToken')
            }
        }
        axios.post(BaseUrl.base_url + '/api/v1/user/updateProfile', EditUser, config)
            .then((response) => {
              localStorage.setItem('profile_firstTime_Added', 'true');
              this.props.onSave(true);
              this.props.getData()
            }).catch((error) => {
        });
    }

    render() {
        const {
            lastName, mobile, currentWorkTitle,mostRecentFieldOfStudy, mostRecentCollegeOrUniversity,
            country, city, currentCompany, twitterHandle, githubURL, linkedInProfileURL,
            careerStage, facebookURL, profilePicture, userInfo, firstName
        } = this.state;
        return (
            <div>
                <Row gutter={8}>
                    <Col span={4} className="text-center">
                        <img height={125} src={profilePicture ? profilePicture : userInfo.picture.data.url}
                             className="pro_img"/>
                    </Col>
                    <Col span={20}>
                        <form>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label>First Name:</label>
                                    <input type="text"
                                           value={firstName}
                                           disabled
                                           className="form-control"/>
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Last Name:</label>
                                    <input type="text"
                                           onChange={(e) => this.onChange(e)}
                                           value={lastName}
                                           name="lastName"
                                           disabled
                                           className="form-control"/>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label>Email Address:</label>
                                    <input type="email"
                                           value={userInfo.email}
                                           disabled
                                           className="form-control"/>
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Phone Number:</label>
                                    <input type="text"
                                           onChange={(e) => this.onChange(e)}
                                           value={mobile}
                                           name="mobile"
                                           pattern="[0-9]*"
                                           className="form-control"/>
                                </div>
                            </div>

                            <div className="form-group col-md-12">
                                <label>Current Work:</label>
                                <input type="text"
                                       onChange={(e) => this.onChange(e)}
                                       value={currentWorkTitle}
                                       name="currentWorkTitle"
                                       className="form-control"/>
                            </div>

                            <div className="form-group col-md-12">
                                <label>College Or University:</label>
                                <input type="text"
                                       onChange={(e) => this.onChange(e)}
                                       value={mostRecentCollegeOrUniversity}
                                       name="mostRecentCollegeOrUniversity"
                                       className="form-control"/>
                            </div>

                            <div className="form-group col-md-12">
                                <label>Field Of Study:</label>
                                <input type="text"
                                       onChange={(e) => this.onChange(e)}
                                       value={mostRecentFieldOfStudy}
                                       name="mostRecentFieldOfStudy"
                                       className="form-control"/>
                            </div>

                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label>Career Stage:</label>
                                    <input type="email"
                                           value={careerStage}
                                           onChange={(e) => this.onChange(e)}
                                           name="careerStage"
                                           className="form-control"/>
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Current Company:</label>
                                    <input type="text"
                                           onChange={(e) => this.onChange(e)}
                                           value={currentCompany}
                                           name="currentCompany"
                                           className="form-control"/>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label>Country/Region:</label>
                                    <select name="country"
                                            className="form-control"
                                            value={country}
                                            onChange={(e) => this.onChange(e)}>
                                        <option value=""></option>
                                        <option value="India">India</option>
                                        <option value="Japan">Japan</option>
                                        <option value="UK">Uk</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-6">
                                    <label>City/Disrict:</label>
                                    <select name="city"
                                            className="form-control"
                                            onChange={(e) => this.onChange(e)}
                                            value={city}>
                                        <option value=""></option>
                                        <option value="Surat">Surat</option>
                                        <option value="Rajkot">Rajkot</option>
                                        <option value="Tokyocity">Tokyocity</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label>Facebook:</label>
                                    <input type="text"
                                           onChange={(e) => this.onChange(e)}
                                           value={facebookURL}
                                           name="facebookURL"
                                           className="form-control"/>
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Twitter:</label>
                                    <input type="text"
                                           onChange={(e) => this.onChange(e)}
                                           value={twitterHandle}
                                           name="twitterHandle"
                                           className="form-control"/>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label>Linkedin:</label>
                                    <input type="text"
                                           onChange={(e) => this.onChange(e)}
                                           value={linkedInProfileURL}
                                           name="linkedInProfileURL"
                                           className="form-control"/>
                                </div>
                                <div className="form-group col-md-6">
                                    <label>Github:</label>
                                    <input type="text"
                                           onChange={(e) => this.onChange(e)}
                                           value={githubURL}
                                           name="githubURL"
                                           className="form-control"/>
                                </div>
                            </div>

                            <div className="form-row col-md-12 save-btn">
                                <Button type="primary" className="center btnSaveProfile"
                                        onClick={this.handleOk}>Save</Button>
                            </div>

                        </form>
                    </Col>
                </Row>
                <p className="text-danger">{this.state.error}</p>
            </div>
        )
    }
}

export default ProfileModel;
