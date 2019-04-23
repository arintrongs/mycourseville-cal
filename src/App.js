import React, { Component } from "react"
import { Button, Input, message, Divider, Spin, Icon } from "antd"
import { withRouter } from "react-router-dom"
import axios from "axios"
import qs from "query-string"
import moment from "moment"
import "./App.css"

import CoursePanel from "./CoursePanel"
import { withBackendUrl } from "./utils"

class App extends Component {
  state = {
    auth: false,
    student_id: "",
    title: "",
    firstName: "",
    lastName: "",
    uid: "",
    token: "",
    courses: [],
    selected_courses: [],
    loading: true,
    last_update: null
  }
  componentDidMount = async () => {
    const token = localStorage.getItem("token")

    if (token) {
      try {
        const { data } = await axios.post(withBackendUrl("/auth/verify"), { token })
        await this.handleRequestCourses({ token })
        this.setState({
          auth: true,
          ...data
        })
      } catch (e) {
        this.setState({ auth: false })
        await this.handleAuthorize()
      }
    } else {
      await this.handleAuthorize()
    }
    this.setState({ loading: false })
  }
  handleRequestCourses = async payload => {
    const { data } = await axios.post(withBackendUrl("/auth/courses"), payload)
    this.setState({ courses: data.map(item => ({ ...item, selected: false })) })
  }
  handleAuthorize = async () => {
    try {
      const { code } = qs.parse(this.props.location.search)
      const { data } = await axios.post(withBackendUrl("/access_token"), { code })

      this.setState({
        auth: true,
        ...data
      })
    } catch (e) {
      console.log(e)
    }
  }
  handleRefreshToken = async refresh_token => {
    try {
      const { data } = await axios.post(withBackendUrl("/refresh_token"), { refresh_token })
      if (data.access_token) {
        sessionStorage.setItem("token_type", data.token_type)
        sessionStorage.setItem("access_token", data.access_token)
        sessionStorage.setItem("expires_in", data.expires_in)
        sessionStorage.setItem("refresh_token", data.refresh_token)
        this.setState({
          token_type: data.token_type,
          access_token: data.access_token,
          expires_in: data.expires_in,
          refresh_token: data.refresh_token
        })
        return true
      }
    } catch (e) {
      return false
    }
  }
  handleLogout = () => {
    localStorage.removeItem("token")
    this.setState({
      auth: false,
      token: ""
    })
  }
  handleLogin = () => {
    window.location.href =
      "https://mycourseville.com/api/oauth/authorize?response_type=code&client_id=K67U5Z58SJ8O1JZJTKCFZKI2GMJH54C39RUFPWRM&redirect_uri=https://mycoursevillecal.firebaseapp.com/"
  }
  handleCopy = e => {
    this.textArea.select()
    document.execCommand("copy")
    message.success("Copied!")
  }
  handleSwitchUpdate = course => e => {
    const new_selected_courses = this.state.selected_courses.filter(
      data => data.course_no !== course.course_no && data.cv_cid !== course.cv_cid
    )
    if (e) {
      new_selected_courses.push({
        course_no: course.course_no,
        cv_cid: course.cv_cid
      })
    }
    this.setState({ selected_courses: new_selected_courses })
  }
  handleUpdate = async () => {
    this.setState({ loading: true })
    try {
      const { data } = await axios.post(withBackendUrl("/auth/update"), {
        selected_courses: this.state.selected_courses,
        token: this.state.token
      })
      message.success("Calendar Updated!")
      this.setState({ loading: false, ...data })
    } catch (e) {
      console.log(e.message)
      message.success("Something went wrong!")
      this.setState({ loading: false })
    }
  }
  renderLoginButton = () => {
    return (
      <div>
        <Button className="login-button" icon="login" size="large" onClick={this.handleLogin}>
          myCourseville Login
        </Button>
      </div>
    )
  }
  renderControlPanelHeader = () => {
    return (
      <div className="header">
        <div className="title">
          <h2>myCourseville Calendar </h2>
        </div>
        <div className="logout-container">
          <Button className="logout-button" icon="logout" type="danger" onClick={this.handleLogout}>
            Logout
          </Button>
          {`${this.state.title}. ${this.state.firstName}  ${this.state.lastName} (${this.state.student_id})`}
        </div>
        <Divider />
        <div className="title">
          <h2>Enable course(s) which you want to add your calendar. </h2>
          Only <b>current semester (2018/2)</b> courses will be shown and only <b>assignments</b> are added to your
          calendar.
        </div>
      </div>
    )
  }
  renderControlPanelFooter = () => {
    return (
      <div className="footer">
        <div className="update-button">
          <Button type="primary" onClick={this.handleUpdate}>
            Update
          </Button>
          <div className="last-update">
            <b>Last update : </b>
            {moment(this.state.last_update).toLocaleString("th")}
          </div>
        </div>
        <div className="url-provider">
          <Input.Group className="calendar-url" compact>
            <Input value={withBackendUrl(`/calendar/${this.state.uid}`)} ref={textarea => (this.textArea = textarea)} />
            <Button type="primary" onClick={this.handleCopy}>
              Copy URL
            </Button>
          </Input.Group>
        </div>
      </div>
    )
  }
  renderControlPanel = () => {
    return (
      <div className="control-panel">
        {this.renderControlPanelHeader()}
        <Divider />
        <CoursePanel
          courses={this.state.courses}
          selected_courses={this.state.selected_courses}
          handleSwitchUpdate={this.handleSwitchUpdate}
        />
        {this.renderControlPanelFooter()}
      </div>
    )
  }
  render() {
    if (this.state.loading) {
      return (
        <div className="App">
          <Spin indicator={<Icon type="loading" style={{ fontSize: 36 }} spin />} tip="Loading..." />
        </div>
      )
    }
    return (
      <div className="App">
        <div className="container">{this.state.auth ? this.renderControlPanel() : this.renderLoginButton()}</div>
      </div>
    )
  }
}

export default withRouter(App)
