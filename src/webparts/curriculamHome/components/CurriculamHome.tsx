import * as React from 'react';
import styles from './CurriculamHome.module.scss';
import { ICurriculamHomeProps } from './ICurriculamHomeProps';
import { Checkbox, Tab, TabList, Divider, SelectTabEvent, SelectTabData, Button } from "@fluentui/react-components";
import * as data from "../data/CurriculamData.json";
export interface ICurriculamHomeStates {
  learnings: any;
  selectedTab: string;
}
export default class CurriculamHome extends React.Component<ICurriculamHomeProps, ICurriculamHomeStates> {
  constructor(props: ICurriculamHomeProps) {
    super(props);
    this.state = {
      learnings: data.learnings,
      selectedTab: "tab1"
    };
  }

  private onTabSelect = (_event: SelectTabEvent, data: SelectTabData) => {
    this.setState({ selectedTab: data.value as string });
  };

  private getCourseCard = (courseItem: any) => {
    return (
      <div className={styles.courseCardWrapper}>
        <div className={styles.imgDescriptionWrapper}>
          <img src={require("../assets/images/" + courseItem.type + ".png")}
            alt={courseItem.type} className={styles.courseTypeImg} />
          <div className={styles.courseDescriptionArea}>
            <span className={styles.courseName}>{courseItem.name}</span>
            <div className={styles.courseNameAndDurationDetails}>
              <div className={styles.courseType + " " + styles[courseItem.type + "Background"]}>{courseItem.type.toUpperCase()}</div>
              <div className={styles.courseTimeAndCredits}><b>Time:</b> {courseItem.time}</div>
              <div className={styles.courseTimeAndCredits}><b>CPE Credit:</b> {courseItem.cpeCreditTime}</div>
            </div>
            <p>{courseItem.description}</p>
          </div>
        </div>
        <div className={styles.markAsCompleteAndRegisterBtnWrapper}>
          <Checkbox label="Mark as Complete" />
          <Button>Register</Button>
        </div>
      </div>
    );
  }
  public render(): React.ReactElement<ICurriculamHomeProps> {
    return (
      <div className={styles.mainContiner}>
        <h1 className={styles.mainHeading}>Curriculam Roadmap</h1>
        <p className={styles.description1}>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
          tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis
          nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
          Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat,
          vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim
          qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p>
        <p className={styles.description2}>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
          tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis
          nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
          Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat,
          vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim
          qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p>
        <div className={styles.filterWrapper}>
          <div className={styles.serviceLineWrapper}>
            <h3 className={styles.filterHeading}>Choose the service line</h3>
            <Divider className={styles.divider} />
            <div>
              <Checkbox label="Checked" className={styles.filterCheckbox} />
            </div>
          </div>
          <div className={styles.levelWrapper}>
            <h3 className={styles.filterHeading}>Click on the level you would like explore</h3>
            <Divider className={styles.divider} />
            <div>
              <Checkbox label="Checked" className={styles.filterCheckbox} />
            </div>
          </div>
        </div>
        <h3 className={styles.myLearningsLabel}>My Learnings</h3>
        <div className={styles.learningsWrapper}>
          <TabList className={styles.learningsTabList} selectedValue={this.state.selectedTab} onTabSelect={this.onTabSelect}>
            <Tab value="tab1">All Programs/Trainings</Tab>
            <Tab value="tab2">Milestone Program</Tab>
            <Tab value="tab3">Technical Training</Tab>
            <Tab value="tab4">Badge Completion</Tab>
            <Tab value="tab5">Other Required/Mandatory Training</Tab>
          </TabList>
          <Divider className={styles.solidDivider} />
          <div>
            {this.state.selectedTab === "tab1" && (
              <div>
                {this.getCourseCard(this.state.learnings[0])}
              </div>
            )}
            {this.state.selectedTab === "tab2" && (
              <div>tab2</div>
            )}
            {this.state.selectedTab === "tab3" && (
              <div>tab3</div>
            )}
            {this.state.selectedTab === "tab4" && (
              <div>tab4</div>
            )}
            {this.state.selectedTab === "tab5" && (
              <div>tab5</div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
