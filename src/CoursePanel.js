import React from "react"
import { List, Divider, Avatar, Switch, Icon } from "antd"

// const semesterYear = [{ year: "2018", semester: "2" }]
class CoursePanel extends React.Component {
  renderCourseList = () => {
    return (
      <List
        itemLayout="horizontal"
        dataSource={this.props.courses}
        renderItem={course => (
          <List.Item
            actions={[
              <Switch
                onChange={this.props.handleSwitchUpdate(course)}
                checked={this.props.selected_courses.some(s_course => s_course.cv_cid === course.cv_cid)}
                checkedChildren={<Icon type="check" />}
                loading={this.props.loading}
              />
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar src={course.course_icon} shape="square" size="large" />}
              title={
                <div className="title">
                  [{course.course_no}] - {course.title}
                </div>
              }
            />
          </List.Item>
        )}
      />
    )
  }
  render() {
    return (
      <div className="course-panel">
        {this.renderCourseList()}
        <Divider />
      </div>
    )
  }
}

export default CoursePanel
