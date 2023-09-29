import * as React from 'react';
import styles from '../scss/CurriculamHome.module.scss';
import { ICurriculamHomeProps } from './ICurriculamHomeProps';
import {
  Checkbox, Tab, TabList, Divider, SelectTabEvent, SelectTabData, Button,
  teamsLightTheme, teamsDarkTheme, teamsHighContrastTheme, FluentProvider, Theme
} from "@fluentui/react-components";
import * as microsoftTeams from "@microsoft/teams-js";
import * as data from "../data/CurriculamData.json";

export interface ICurriculamHomeStates {
  learnings: any;
  selectedTab: string;
  currentTeamsTheme: Theme;
  currentThemeName: string;
  serviceLineFilters: Array<any>;
  levelFilters: Array<any>;
  selectedFilters: ISelectedFilters;
  filteredData: Array<any>;
}

export interface ISelectedFilters {
  serviceLine: Array<any>;
  level: Array<any>;
}
export default class CurriculamHome extends React.Component<ICurriculamHomeProps, ICurriculamHomeStates> {
  constructor(props: ICurriculamHomeProps) {
    super(props);
    this.state = {
      learnings: data.learnings,
      selectedTab: "tab1",
      currentTeamsTheme: teamsLightTheme,
      currentThemeName: "default",
      serviceLineFilters: [],
      levelFilters: [],
      selectedFilters: {
        serviceLine: [],
        level: []
      },
      filteredData: data.learnings
    };

    this.getCourseCard = this.getCourseCard.bind(this);
    this.onTabSelect = this.onTabSelect.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
  }

  //Component Life Cycle Method
  public componentDidMount() {
    // Get current Teams theme to pass into fluent provider
    microsoftTeams.initialize();
    microsoftTeams.getContext(ctx => {
      const theme = ctx.theme || "default";
      this.updateCMPTheme(theme);
    });
    microsoftTeams.registerOnThemeChangeHandler((theme: string) => {
      this.updateCMPTheme(theme);
    });
    this.getFilters();
  }

  //Component Life Cycle Method
  public componentDidUpdate(_prevProps: Readonly<ICurriculamHomeProps>, prevState: Readonly<ICurriculamHomeStates>): void {
    if (prevState.selectedFilters !== this.state.selectedFilters) {
      if (this.state.selectedFilters.serviceLine.length === 0 && this.state.selectedFilters.level.length === 0) {
        this.setState({ filteredData: this.state.learnings });
      }
      else if (this.state.selectedFilters.level.includes("All")) {
        this.setState({ filteredData: this.state.learnings });
      }
      else {
        this.filterData();
      }
    }
  }

  //Filter data based on selected filters
  public filterData = () => {
    let filteredData = [];
    this.state.learnings.forEach((item: any) => {
      for (let serviceLine of item.serviceLines) {
        if (this.state.selectedFilters.serviceLine.indexOf(serviceLine) > -1) {
          if (filteredData.indexOf(item) === -1) {
            filteredData.push(item);
            break;
          }
        }
      }

      for (let level of item.levels) {
        if (this.state.selectedFilters.level.indexOf(level) > -1) {
          if (filteredData.indexOf(item) === -1) {
            filteredData.push(item);
            break;
          }
        }
      }
    });
    this.setState({ filteredData: filteredData });
  }

  //Get all filters from data
  public getFilters = () => {
    let serviceLineFilters = [];
    let levelFilters = ["All"];
    this.state.learnings.forEach((item: any) => {
      item.serviceLines.forEach((serviceLine: any) => {
        if (serviceLineFilters.indexOf(serviceLine) === -1) {
          serviceLineFilters.push(serviceLine);
        }
      });
      item.levels.forEach((level: any) => {
        if (levelFilters.indexOf(level) === -1) {
          levelFilters.push(level);
        }
      });
    });
    this.setState({ serviceLineFilters: serviceLineFilters, levelFilters: levelFilters });
  }

  //Get Current theme when Teams theme is switched
  protected updateCMPTheme = (theme: string) => {
    switch (theme.toLocaleLowerCase()) {
      case "default":
        this.setState({ currentTeamsTheme: teamsLightTheme, currentThemeName: "default" });
        break;
      case "dark":
        this.setState({ currentTeamsTheme: teamsDarkTheme, currentThemeName: "dark" });
        break;
      case "contrast":
        this.setState({ currentTeamsTheme: teamsHighContrastTheme, currentThemeName: "contrast" });
        break;
    }
  };

  //Handle filter change
  public onFilterChange = (filterType, filterValue, isChecked) => {
    if (filterType === "serviceLine") {
      if (isChecked) {
        const selectedFilters = this.state.selectedFilters;
        selectedFilters.serviceLine.push(filterValue);
        this.setState({ selectedFilters: { ...selectedFilters } });
      }
      else {
        const selectedFilters = this.state.selectedFilters;
        const index = selectedFilters.serviceLine.indexOf(filterValue);
        if (index > -1) {
          selectedFilters.serviceLine.splice(index, 1);
        }
        this.setState({ selectedFilters: { ...selectedFilters } });
      }
    }
    if (filterType === "level") {
      if (isChecked) {
        const selectedFilters = this.state.selectedFilters;
        selectedFilters.level.push(filterValue);
        this.setState({ selectedFilters: { ...selectedFilters } });
      }
      else {
        const selectedFilters = this.state.selectedFilters;
        const index = selectedFilters.level.indexOf(filterValue);
        if (index > -1) {
          selectedFilters.level.splice(index, 1);
        }
        this.setState({ selectedFilters: { ...selectedFilters } });
      }
    }

  }

  //Handle tab selection
  private onTabSelect = (_event: SelectTabEvent, data: SelectTabData) => {
    this.setState({ selectedTab: data.value as string });
  };

  //Get course card
  private getCourseCard = (courseItem: any) => {
    return (
      <div className={styles.courseCardWrapper}>
        <div className={styles.imgDescriptionWrapper}>
          <img src={require("../assets/images/" + courseItem.type + ".png")}
            alt={courseItem.type} className={styles.courseTypeImg} />
          <div className={styles.courseDescriptionArea}>
            <span className={styles.courseName}>{courseItem.name}</span>
            <div className={styles.courseTypeAndDurationDetails}>
              <div className={styles.courseType + " " + styles[courseItem.type + "Background"]}>{courseItem.type.toUpperCase()}</div>
              <div className={styles.courseTimeAndCredits}><b>Time:</b> {courseItem.time}</div>
              <div className={styles.courseTimeAndCredits}><b>CPE Credit:</b> {courseItem.cpeCreditTime}</div>
            </div>
            <p className={styles.courseDescription}>{courseItem.description}</p>
          </div>
        </div>
        <div className={styles.markAsCompleteAndRegisterBtnWrapper}>
          <Checkbox label="Mark as Complete" labelPosition='before' />
          <Button className={styles.registerBtn}>Register</Button>
        </div>
      </div>
    );
  }

  //Render method
  public render(): React.ReactElement<ICurriculamHomeProps> {
    const allData = this.state.filteredData.map((item: any) => this.getCourseCard(item));
    const milestoneData = this.state.filteredData.map((item: any) => {
      if (item.type === "milestone") {
        return (
          this.getCourseCard(item)
        );
      }
    });
    const technicalData = this.state.filteredData.map((item: any) => {
      if (item.type === "technical") {
        return (
          this.getCourseCard(item)
        );
      }
    });
    const badgeData = this.state.filteredData.map((item: any) => {
      if (item.type === "badge") {
        return (
          this.getCourseCard(item)
        );
      }
    });
    const otherData = this.state.filteredData.map((item: any) => {
      if (item.type !== "technical" && item.type !== "badge" && item.type !== "milestone") {
        return (
          this.getCourseCard(item)
        );
      }
    });
    console.log(milestoneData);

    return (
      <FluentProvider className={styles.mainContiner} theme={this.state.currentTeamsTheme}>
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
            <div className={styles.serviceLineCheckboxes}>
              {this.state.serviceLineFilters.map((item: any) => {
                return (
                  <Checkbox label={item}
                    className={styles.filterCheckbox} key={item}
                    onChange={(ev, data) => { this.onFilterChange("serviceLine", item, data.checked) }}
                  />
                );
              })}
            </div>
          </div>
          <div className={styles.levelWrapper}>
            <h3 className={styles.filterHeading}>Click on the level you would like explore</h3>
            <Divider className={styles.divider} />
            <div className={styles.levelCheckboxes}>
              {this.state.levelFilters.map((item: any) => {
                return (
                  <Checkbox label={item}
                    className={styles.filterCheckbox} key={item}
                    onChange={(ev, data) => { this.onFilterChange("level", item, data.checked) }}
                  />
                );
              })}
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
                {allData.every(element => element === undefined) ? <div className={styles.noDataFoundLabel}>No data found</div>
                  : allData
                }
              </div>
            )}
            {this.state.selectedTab === "tab2" && (
              <div>
                {milestoneData.every(element => element === undefined) ? <div className={styles.noDataFoundLabel}>No data found</div>
                  : milestoneData
                }
              </div>
            )}
            {this.state.selectedTab === "tab3" && (
              <div>
                {technicalData.every(element => element === undefined) ? <div className={styles.noDataFoundLabel}>No data found</div>
                  : technicalData
                }
              </div>
            )}
            {this.state.selectedTab === "tab4" && (
              <div>
                {badgeData.every(element => element === undefined) ? <div className={styles.noDataFoundLabel}>No data found</div>
                  : badgeData
                }
              </div>
            )}
            {this.state.selectedTab === "tab5" && (
              <div>
                {otherData.every(element => element === undefined) ? <div className={styles.noDataFoundLabel}>No data found</div>
                  : otherData
                }
              </div>
            )}
          </div>
        </div>
      </FluentProvider>
    );
  }
}
