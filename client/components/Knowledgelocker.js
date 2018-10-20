import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import DOMPurify from 'dompurify';
import Header from './header';
import Footer from './footer';
import AdvertisementVertical from './advertical';
import axios from 'axios';
import BaseUrl from '../config/properties';
import { Collapse } from 'antd';
import ReactPlayer from 'react-player';
import Bookmarks from './Bookmarks'
import MyAccount from './MyAccount'
import Courses from './Courses'
import ProfileModel from './ProfileModel'

const Panel = Collapse.Panel;
function callback(key) {
	console.log(key);
  }
const text = 'hello';
require('../styles/article.css');
require("async");
function Player(props) {
	return(
		<ReactPlayer
		  url={props.video}
		  width = '100%'
		  height = '254'
		  youtubeConfig={{ playerVars: { showinfo: 1 } }}
		/>
		);
}

class KnowledgeLocker extends React.Component {
	constructor(props) {
	    super(props);
	    this.state={
	    	currentTab:'NewsFeed',
	    	careerPath:[],
			  knowledgeBlocks:[],
			  recommendedContentList:[],
	    	authToken:'',
	    	userData:[],
			  url:'',
				isBookMark: false,
				isMyAccount: false,
        bookmarksList:[],
        profileInfo:[],
        courseInfo:[]
	    }
	    this.changeTab = this.changeTab.bind(this);
	    this.getBookmarkData = this.getBookmarkData.bind(this);
	    this.getProfileInfo = this.getProfileInfo.bind(this);
	    this.getCourseInfo = this.getCourseInfo.bind(this);
	  }

		componentDidMount () {
			let isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn'));
			let authToken = null;
			let userData = [];
			if (isLoggedIn == true)  {
				 authToken = localStorage.getItem('authToken');
				 userData = JSON.parse(localStorage.getItem('userData'));
				 console.log(userData);
				 this.setState({
							authToken:authToken,
							userData:userData,
							url:userData.picture.data.url
						});
			 }

    console.log({authToken});
	   if (authToken) {
			axios.get(BaseUrl.base_url+"/api/v1/CareerPath/Following?UserToken="+authToken).then((response)=>{
				if (response && response.data && response.data.careerPaths && response.data.careerPaths.length) {
					this.setState({
						careerPath:response.data.careerPaths
					});
				}
			});
			axios.get(BaseUrl.base_url+"/api/v1/KnowledgeBlock/Following?UserToken="+authToken).then((response)=>{
				if (response && response.data && response.data.knowledgeBlocks && response.data.knowledgeBlocks.length) {
					this.setState({
						knowledgeBlocks:response.data.knowledgeBlocks
					});
				}
			});
			axios.get(BaseUrl.base_url+"/api/v1/recommended/contentfeed?start=1").then((response)=>{
				if (response.data.recommendedContentList.length) {
					this.setState({
						recommendedContentList:response.data.recommendedContentList
					});
				}
			});
      this.getBookmarkData()
      this.getProfileInfo()
      this.getCourseInfo()
		}
	}

  getBookmarkData() {
    const config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('authToken')
      }
    }
		axios.get(BaseUrl.base_url+"/api/v1/bookmark/getBookmarksForUser?start=1", config).then((response) => {
    	this.setState({
          bookmarksList: response.data.bookmarks.length && response.data.bookmarks
        })
      }).catch((error) => {
			this.setState({error:error.message})
    });
  }

  getProfileInfo(){
    const config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('authToken')
      }
    }
    axios.get(BaseUrl.base_url+"/api/v1/user/profile", config).then((response) => {
    	const profileInfo = {};
    	if (response.data) {
    		Object.keys(response.data).forEach(key => {
          profileInfo[key] = response.data[key] !== "null" ? response.data[key] : ''
				})
			}
      this.setState({
        profileInfo: profileInfo
      })
    }).catch((error) => {
      this.setState({error:error.message})
    });
  }

    getCourseInfo() {
        const config = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('authToken')
            }
        }
        axios.get(BaseUrl.base_url+"/api/v1/Courses/ListAllCourses", config).then((response) => {
            this.setState({
                courseInfo: response.data.length && response.data
            })
        }).catch((error) => {
            this.setState({error:error.message})
        });
    }

	renderThis(obj, index){
		console.log(obj.careerPathName);
		return(
			// <p>{obj.careerPathName}</p>
			<li className="myList" key={index}><Link to={"/careerdetails/"+obj.careerPathName_UrlEncoded+"/career_chart_and_job_roles"}>{obj.careerPathName}</Link></li>
			);
	}
	renderKb(obj, index){
		console.log(obj.knowledgeBlocks);
		return(
			// <p>{obj.knowledgeBlocks}</p>
			<li className="myList" key={index}><Link to={"/knowledgeblockdetails/"+obj.knowledgeBlock_Name_UrlEncoded+"/get_started"}>{obj.knowledgeBlock_Name}</Link></li>
			);
	}

  changeTab(tab){
    this.setState({currentTab: tab});
  }

	accordianComp(){
		return(
			<div>
        {this.state.careerPath.map((obj, index) => {
          return this.renderThis(obj, index)
        })}
			</div>
			);
	}
	accordianKB(){
    return (
			<div>
        {this.state.knowledgeBlocks.map((obj, index) => {
          return this.renderKb(obj, index)
        })}
			</div>
    );
	}

	renderContentFeed(){
    return (
			<div>
        {this.state.recommendedContentList.map((obj, index) => {
          return this.renderFeed(obj, index)
        })}
			</div>
    );
	}

	renderFeed(obj,index)  {
		let background = {
			width:'100%',
			backgroundImage : "url("+obj.content_Image_URL_large+")",
			backgroundRepeat  : 'no-repeat',
			height :"254px",
			backgroundSize : '100% 100%'
		};
		if(obj.recommended_Content_Type == 'article') {
			return (
				<div className="block_locker" key={index}>
					<div className=" col-md-12 col-sm-12 col-xs-12 block_image">
						<a href={obj.content_URL} target="_blank">
							<div className="image_article" style={background}></div>
						</a>
					</div>
					<div className="knl_block">
						<div className="sub_content">
							<a href={obj.content_URL} target="_blank"><p className="block_title">{obj.content_Title}</p></a>
							<p className="knl_disc">{obj.content_Description}</p>
						</div>
					</div>
					<div className="col-md-12">
						<p className="article_innercontwrapknl">
							<i>{obj.feed_content_tags}</i>
						</p>
						<p className="article_innercontwrapknl">
							<i className="fa fa-circle dotart" aria-hidden="true"/>
							<i>{obj.content_created_Date}</i>
						</p>
					</div>
				</div>
			)
		}
		else {
			return (
			<div className="block" key={index}>
				<div className=" col-md-12 col-sm-12 col-xs-12 block_image">
					<Player video={obj.content_URL} />
				</div>
				<div className="knl_block">
					<div className="sub_content">
						<a href={obj.content_URL} target="_blank"><p className="block_title">{obj.content_Title}</p></a>
						<p className="knl_disc">{obj.content_Description}</p>
					</div>
				</div>
				<div className="col-md-12">
					<p className="article_innercontwrapknl"><i>{obj.feed_content_tags}</i></p>
					<p className="article_innercontwrapknl"><i className="fa fa-circle dotart" aria-hidden="true"></i><i>{obj.content_created_Date}</i></p>
				</div>
			</div>
			)
		}
	}

	render() {
		const {profileInfo, currentTab, url, userData, courseInfo} = this.state
		return(
			<div>
				<div className="main_div">
					<Header/>
				</div>
				<div className="container">
					<div className="col-md-12 col-sm-12 col-xs-12 article_content">
						<h2 className="article_innercont">My Data</h2>
					</div>
					<div className="col-md-12 col-sm-12 col-xs-12 article_content">
						<div>
							<div className="col-md-3 col-sm-3 col-xs-12 extra-padding side-pan no_left_padding">
								<div className="block">
									<div className="knl_locfull">
										<div className="knl_locfullinner">
											{
                        url && <div className="knl_locfullimage">
																	<img src={url} className="pro_img"/>
															 </div>
											}
											<div className="knl_locfulluser">
												<p className="knl_locfulluserwrap">{userData.name}</p>
                        {/*<p className="knl_locfulluserinnerwrap">San Francisco</p>*/}
											</div>
										</div>
										<p onClick={() => {this.changeTab('NewsFeed')}}
											 className={currentTab === "NewsFeed" ? "text-info" : "cursor" }>News Feed</p>
										<p className="knw_car">My Career Paths</p>
										<div className="full_app">
											<ul>{this.accordianComp()}</ul>
										</div>
										<p className="knw_car">My KnowledgeBlocks</p>
										<div className="full_app">
											<ul>{this.accordianKB()}</ul>
										</div>

										<div className="full_app">
											<p onClick={() => {this.changeTab('BookMarks')}}
												 className={currentTab === "BookMarks" ? "text-info knw_car" : "knw_car cursor"}>My Bookmarks</p>
										</div>
			 							<div className="full_app">
            								<p onClick={() => {this.changeTab('Courses')}}
            									className={currentTab === "Courses" ? "text-info knw_car" : "knw_car cursor"}>Courses</p>
        								</div>

										<div className="full_app">
											<p onClick={() => {this.changeTab('MyAccount')}}
												 className={currentTab === "MyAccount" ? "text-info knw_car" : "knw_car cursor"}>My Account</p>
										</div>

									</div>
								</div>
							</div>
						</div>

						<div>
							<div className={` ${currentTab === 'MyAccount' || currentTab === 'Courses' ? 'col-md-9 col-sm-9 ' : 'col-md-6 col-sm-6 '} col-xs-12 extra-padding`}>
                {currentTab === 'BookMarks' &&
									<Bookmarks getData={this.getBookmarkData}
														 error={this.state.error}
														 bookmarksList={this.state.bookmarksList}/>}
                {currentTab === 'Courses' &&
					<Courses courseInfo={courseInfo} getCourse={this.getCourseInfo}/>}
                {currentTab === 'MyAccount' &&
                    <MyAccount profileInfo={profileInfo}
                        getAccount={this.getProfileInfo}/>}
                {currentTab === 'NewsFeed' && this.renderContentFeed()}
							</div>
							<div>
                {
                  currentTab !== 'MyAccount' || currentTab !== 'Courses' ?
								<div className="col-md-3 col-sm-3 col-xs-12 extra-padding no_right_padding">
                  {/*
									<div className="full_app">
										<p className="art_spon">Recommended Learnings</p>
									</div>
								*/}
									<div className="ad_links_vertical">
										<p className="sponsored_links_vertical">Useful Links</p>
										<AdvertisementVertical/>
									</div>
								</div>:null
                }
							</div>
						</div>
					</div>
				</div>
				<Footer/>
			</div>
		)
	}
}

export default KnowledgeLocker;
