import React from 'react';
import {Row, Col, Icon, Modal, Button, Menu} from 'antd'
import axios from 'axios';
import BaseUrl from '../config/properties';

const ButtonGroup = Button.Group;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class Courses extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      editModelShow: false,
        showFlag: true,
        showLesson: false,
        viewLesson: false

    };
    this.handleCancel = this.handleCancel.bind(this);
  }

  isEditModel(){
    this.setState({
      editModelShow: true
    })
  }

    handleClick(e) {
        console.log('click ', e);
    }

    courseNameDetails(courseName) {
        const config = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('authToken')
            }
        }
        axios.get(BaseUrl.base_url + `/api/v1/Courses/Name/${courseName}/Details`, config).then((response) => {
            const courseDescription = {};
            if (response.data) {
                this.setState({
                    courseDescription: response.data,
                    showFlag: false,
                    showLesson: true
                })
            }
        }).catch((error) => {
            this.setState({error: error.message})
        });
}

  handleCancel(isReFetch) {
    this.setState({
      editModelShow: false,
    });
    if (isReFetch) {
      this.props.getCourse();
    }
  }

  handleBack() {
    const {courseInfo} = this.props
        this.setState({
            courseInfo: Courses,
            showFlag: true,
            showLesson: false
        });
  }

  handleLessons() {
    const {courseDescription} = this.state
        this.setState({
            courseDescription: courseDescription,
            showFlag: false,
            showLesson: false,
            viewLesson: true
        });
    }

  viewLessons (item, key) {
    this.setState({
        lesson: item,
        key: key
    })
  }

  showMenu (item, key) {
    return (
        key === "Intro" ?
            <div>
                <Col span={18}>
                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <label>Course Name:</label>
                            <p>{item && item.microLesson_Name}</p>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <p>Please Select a Lessons from the List</p>
                        </div>
                    </div>
                </Col>
            </div>
        : <div>
            <Col span={18}>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label>Course Name:</label>
                            <p>{item && item.microLesson_Name}</p>
                    </div>
                </div>
            </Col>
                {/*<div className="form-group col-md-6">
                  <label>Name:</label>
                  <p>{item.microLesson_Id}</p>
              </div>
              <div className="form-group col-md-6">
                  <label>Author:</label>
                  <p>{courseDescription && courseDescription.microCourseCreator_Name}</p>
              </div>*/}
            </div>
        )
    }

  render() {
    const { editModelShow, courseDescription, showFlag, showLesson, lesson, key, viewLesson } = this.state
    const Courses = this.props.courseInfo || {}
    const isProfileSet = localStorage.getItem('profile_firstTime_Added')

    return (
        <div>
            {
                showFlag ?
                    <div className="block_locker">
                        <div className="col-md-12 col-sm-12 col-xs-12 block_image account-pg">
                            {
                                Courses && Courses.map((item,i) => (
                                        <div key={i.toString()} className="col-md-6">
                                            <div className="panel panel-default">
                                                <div className="row">
                                                    <div className="col-md-10">
                                                        <div onClick={() => this.courseNameDetails(item.microCourse_Name_UrlEncoded)}>
                                                            <h4>{item && item.microCourse_Name}</h4>
                                                        </div>
                                                        <br/>
                                                        <h5>Author:</h5>
                                                        <p>{item && item.microCourseCreator_Name}</p><br/>
                                                        <p>Tags:</p>
                                                        <span>{item && item.microCourse_Tags.replace(/,/g,", ")}</span><br/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )
                            }
                        </div>
                    </div> : null
            }
            {
                showLesson && courseDescription ?
                    <div className="block_locker">
                        <Row gutter={8}>
                            <Col span={4} className="text-center">
                                <img height={125} src={courseDescription && courseDescription.microCourse_ImageURL }
                                     className="pro_img"/>
                            </Col>
                            <Col span={20}>
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label>Name:</label>
                                        <p>{courseDescription && courseDescription.microCourse_Name}</p>
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label>Author:</label>
                                        <p>{courseDescription && courseDescription.microCourseCreator_Name}</p>
                                    </div>
                                </div>

                                <div className="form-group col-md-12">
                                    <label>Tags:</label>
                                    <p>{courseDescription && courseDescription.microCourse_Tags}</p>
                                </div>

                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label>Lessons:</label>
                                        <p>{courseDescription && courseDescription.microLessonsList.length}</p>
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label>Quiz:</label>
                                        <p>{courseDescription && courseDescription.numQuizzes}</p>
                                    </div>

                                </div>

                                <div className="form-group col-md-12">
                                    <label>Course Description:</label>
                                    <p>{courseDescription && courseDescription.microCourse_Description}</p>
                                </div>

                                <div className="form-row col-md-12 text-center">
                                    {/*<Button type="primary" className="center btnSaveProfile"
                                            onClick={this.handleOk}>View Lessons</Button>
                                    <Button type="primary" className="center btnSaveProfile"
                                            onClick={() => this.handleBack()}>Back to Lessons</Button>*/}
                                    <ButtonGroup>
                                        <Button type="primary" onClick={() => this.handleBack()}>
                                            <Icon type="left" />Back to Courses
                                        </Button>
                                        <Button type="primary" onClick={() => this.handleLessons()}>
                                            View Lessons<Icon type="right" />
                                        </Button>
                                    </ButtonGroup>
                                </div>
                            </Col>
                        </Row>
                    </div>
                : null
            }

            {
                viewLesson && courseDescription ?
                    <div className="block_locker">
                        <Row gutter={8}>
                            <Col span={6} className="text-center">
                                <Menu
                                    onClick={() =>this.handleClick}
                                    style={{ width: 200 }}
                                    defaultSelectedKeys={['1']}
                                    defaultOpenKeys={['sub1']}
                                    mode="inline"
                                >
                                    {/*<SubMenu key="sub1" title={<span><Icon type="mail" /><span>Introduction</span></span>} onClick={() => this.viewLessons(item, "Intro")}>
                                    </SubMenu>*/}
                                    <Menu.Item key="sub1">
                                        <p onClick={() => this.viewLessons(courseDescription && courseDescription.microCourse_Name, "Intro")}>Introduction</p>
                                    </Menu.Item>
                                    <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>Lessons</span></span>}>
                                        {
                                            courseDescription && courseDescription.microLessonsList.map((item,i) => (
                                                <Menu.Item key={i}>
                                                    <p onClick={() => this.viewLessons(item, "Lesson")}>Lesson {item.microLesson_Id}</p>
                                                </Menu.Item>
                                                )
                                            )
                                        }
                                    </SubMenu>
                                </Menu>
                            </Col>

                            {this.showMenu(lesson, key)}
                            {/*<Col span={18}>
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label>Name:</label>
                                        <p>{courseDescription && courseDescription.microCourse_Name}</p>
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label>Author:</label>
                                        <p>{courseDescription && courseDescription.microCourseCreator_Name}</p>
                                    </div>
                                </div>

                                <div className="form-group col-md-12">
                                    <label>Tags:</label>
                                    <p>{courseDescription && courseDescription.microCourse_Tags}</p>
                                </div>
                            </Col>*/}
                        </Row>
                    </div>
                : null
            }
        </div>

    )
  }
}

export default Courses;
