# Jira Clone
Access To Live Project: [https://www.jira-herman.tk](https://www.jira-herman.tk)

## Description

This project attempts to clone the issue and project tracking application known as Jira.<br>
More specifically, the application and website are implemented, including the user interface, RESTful API, authentication functionality, and data store requirements.

## Technologies Used
- Ubuntu 22.04
- Node v18.2.0
- Express 4.17.2
- PostgreSQL 13.4
- Redis v6.0.16
- React 17.0.2
- HTML + CSS
- JavaScript
- AWS EC2, RDS, S3, ALB

## Application Overview
As an application meant to faciliate project management and issue tracking, this clone of Jira allows users to fetch, create, delete, and modify issues. In addition, users can modify project and user settings (such as name and user image).

The user must first log in or register to access the project in Jira.

![Login](docs/login.png)

Once the user is logged in, the main page is loaded. This page displays a side bar, navigation bar, and the kanban board displaying all issues in the columns corresponding to their statuses.

![Kanban Board](docs/kanbanBoard.png)

Through the sidebar (in blue) to the left of the page, the user has access to several actions including a text-based search, and the ability to create a new issue. Upon clicking the + icon, a modal is displayed with different fields used to initialize the issue information. This includes fields for the following: type, priority, summary, description, reporter, and assignees.

![Create Issue Modal](docs/createIssueModal.png)

Text-based search looks for a string match in the issue summary or description:
![Text-based search](docs/textSearch.png)

In addition to the functionality available through the sidebar, the user can also filter the issues displayed in the kanban board using different methods:
- Assignee(s) Filter: Click on one or more user images to view only issues pertaining to the selected user(s).
- Summary Text Filter: Type in text in the search bar which will be matched against issue summaries.
- My Issues Filter: Click on 'Only My Issues' button to display only issues of logged in user.
- Recently Updated Filter: Click on 'Recently Updated' button to display issues recently modifed.

It is worth noting that these filters are layered when more than one is used. When one or more filters are active, they can be cleared from kanban board using the 'Clear All' button displayed at the end of the line.

![Kanban Board Filters](docs/kanbanBoardFilters.png)

In order to modify an issue status, one simply click and drag an issue card to the target status column, or click on the issue card which will open a modal displaying all relevant data.

Click and drag:<br>
![Click-And-Drag Issue](docs/clickAndDragIssue.png)

By clicking on an issue card, a modal pops up which displays all issue fields including type, summary, description, status, reporter,assignees, and priority—all of which can be modified. In addition, the modal consists of a comments section where the user can view existing comments and enter a new comment.

![Issue Modal](docs/issueModal.png)

On the upper right corner of the modal, the user is able to delete the issue, expand the issue (navigating to a different view), and close the modal. By expanding the issue, a page is loaded in which only the issue information is displayed. This page is shareable via url with other project team members.

![Issue View Page](docs/issueViewPage.png)

The navigation bar allows the user to navigate to the kanban board, project settings, and user settings pages. For this clone, the other listed items (Releases, Issues and Filters, Pages, Reports, and Components) are not implemented.

In the project settings page, one can modify the project name, URL, category, and description:
![Project Settings](docs/projectSettings.png)

In the user settings page, one can modify the name of the user, and the image used in the application. 
![User Settings](docs/userSettings.png)