import React, { useState } from "react";
import { TabContent, TabPane, Nav, NavLink, NavItem } from "reactstrap";
import classnames from "classnames";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

// Modern replacement for the Nestable component using react-beautiful-dnd
const DraggableList = ({ items, listId }) => {
  return (
    <Droppable droppableId={listId}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="task-list"
        >
          {items.map((item, index) => (
            <Draggable
              key={item.id}
              draggableId={`${listId}-${item.id}`}
              index={index}
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  {item.content}
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

// Modern replacement for Donut component
const DonutChart = ({ value, color }) => {
  return (
    <div style={{ width: 90, height: 90, margin: "0 auto" }}>
      <CircularProgressbar
        value={value}
        text={`${value}%`}
        styles={{
          path: {
            stroke: color,
            strokeLinecap: "butt",
            transition: "stroke-dashoffset 0.5s ease 0s",
          },
          trail: {
            stroke: "#d6d6d6",
          },
          text: {
            fill: "#333",
            fontSize: "16px",
            dominantBaseline: "middle",
            textAnchor: "middle",
          },
        }}
      />
    </div>
  );
};

const TaskBoard = () => {
  // State hooks
  const [activeTab, setActiveTab] = useState(1);
  const [isCardRemove, setIsCardRemove] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Handle drag and drop
  const onDragEnd = (result) => {
    // Implementation for drag and drop logic would go here
    console.log("Item moved:", result);
  };

  // Task card component
  const TaskCard = ({ title, startDate, endDate, description, team }) => (
    <div className="dd-item">
      <div className="dd-handle">
        <h6>{title}</h6>
        {startDate && endDate && (
          <span className="time">
            <span className="text-primary">Start: {startDate}</span> to{" "}
            <span className="text-danger">Complete: {endDate}</span>
          </span>
        )}
        <p>{description}</p>
        {team && (
          <>
            <div
              data-tooltip-id="team-tooltip"
              data-tooltip-content="Team Members"
            />
            <ul className="list-unstyled team-info">
              {team.map((member, index) => (
                <li key={index}>
                  <img
                    src={member.avatar || "../assets/images/xs/avatar1.jpg"}
                    data-tooltip-id="team-tooltip"
                    data-tooltip-content="Team Member"
                    alt="Avatar"
                  />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );

  // Planned items
  const plannedItems = [
    {
      id: "p1",
      content: (
        <TaskCard
          title="Dashboard"
          startDate="5 Aug"
          endDate="15 Aug"
          description="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
          team={[
            { avatar: "../assets/images/xs/avatar1.jpg" },
            { avatar: "../assets/images/xs/avatar2.jpg" },
            { avatar: "../assets/images/xs/avatar5.jpg" },
          ]}
        />
      ),
    },
    {
      id: "p2",
      content: (
        <TaskCard
          title="New project"
          startDate="6 Aug"
          endDate="28 Aug"
          description="It is a long established fact that a reader will be distracted."
        />
      ),
    },
    {
      id: "p3",
      content: (
        <TaskCard
          title="Feed Details"
          description="There are many variations of passages of Lorem Ipsum available, but the majority have suffered."
        />
      ),
    },
  ];

  // In progress items
  const progressItems = [
    {
      id: "ip1",
      content: (
        <TaskCard
          title="New Code Update"
          description="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        />
      ),
    },
    {
      id: "ip2",
      content: (
        <TaskCard
          title="Meeting"
          startDate="5 Aug"
          endDate="11 Aug"
          description="The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested."
          team={[
            { avatar: "../assets/images/xs/avatar7.jpg" },
            { avatar: "../assets/images/xs/avatar9.jpg" },
          ]}
        />
      ),
    },
    {
      id: "ip3",
      content: (
        <TaskCard
          title="New project"
          description="It is a long established fact that a reader will be distracted."
        />
      ),
    },
    {
      id: "ip4",
      content: (
        <TaskCard
          title="Feed Details"
          description="There are many variations of passages of Lorem Ipsum available, but the majority have suffered."
        />
      ),
    },
  ];

  // Completed items
  const completedItems = [
    {
      id: "c1",
      content: (
        <TaskCard
          title="Job title"
          description="If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text."
          team={[
            { avatar: "../assets/images/xs/avatar4.jpg" },
            { avatar: "../assets/images/xs/avatar5.jpg" },
            { avatar: "../assets/images/xs/avatar6.jpg" },
            { avatar: "../assets/images/xs/avatar8.jpg" },
          ]}
        />
      ),
    },
    {
      id: "c2",
      content: (
        <TaskCard
          title="Event Done"
          description="Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical"
        />
      ),
    },
    {
      id: "c3",
      content: (
        <TaskCard
          title="New Code Update"
          description="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        />
      ),
    },
  ];

  return (
    <>
      <div className="section-body">
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center">
            <div className="header-action">
              <h1 className="page-title">TaskBoard</h1>
              <ol className="breadcrumb page-breadcrumb">
                <li className="breadcrumb-item">
                  <a href="#">Ericsson</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  TaskBoard
                </li>
              </ol>
            </div>

            <Nav tabs className="page-header-tab">
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === 1 })}
                  onClick={() => setActiveTab(1)}
                >
                  Task List
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === 2 })}
                  onClick={() => setActiveTab(2)}
                >
                  Scrum Type
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === 3 })}
                  onClick={() => setActiveTab(3)}
                >
                  Add Task
                </NavLink>
              </NavItem>
            </Nav>
          </div>
        </div>
      </div>

      <div className="section-body mt-4">
        <div className="container-fluid">
          <TabContent activeTab={activeTab}>
            {/* Tab 1: Task List */}
            <TabPane tabId={1} className={classnames(["fade show"])}>
              <div className="row clearfix mt-2">
                <div className="col-lg-3 col-md-6">
                  <div className="card">
                    <div className="card-body text-center">
                      <h6>Planned</h6>
                      <DonutChart value={23} color="#2185d0" />
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card">
                    <div className="card-body text-center">
                      <h6>In progress</h6>
                      <DonutChart value={43} color="#f2711c" />
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card">
                    <div className="card-body text-center">
                      <h6>Completed</h6>
                      <DonutChart value={83} color="#21ba45" />
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card">
                    <div className="card-body text-center">
                      <h6>In Completed</h6>
                      <DonutChart value={12} color="#e03997" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-hover table-vcenter mb-0 table_custom spacing8 text-nowrap">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Task</th>
                      <th>Team</th>
                      <th>Duration</th>
                      <th>Action</th>
                      <th className="w200"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>01</td>
                      <td>
                        <h6 className="mb-0">New code Update on github</h6>
                        <span>
                          It is a long established fact that a reader will be
                          distracted...
                        </span>
                      </td>
                      <td>
                        <ul className="list-unstyled team-info mb-0 w150">
                          {[
                            "../assets/images/xs/avatar1.jpg",
                            "../assets/images/xs/avatar1.jpg",
                            "../assets/images/xs/avatar1.jpg",
                          ].map((src, index) => (
                            <li key={index}>
                              <img
                                src={src}
                                data-tooltip-id="team-tooltip"
                                data-tooltip-content="Team Member"
                                alt="Avatar"
                              />
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td>
                        <div className="text-info">Start: 3 Jun 2019</div>
                        <div className="text-pink">End: 15 Jun 2019</div>
                      </td>
                      <td>
                        <span className="tag tag-blue">Planned</span>
                      </td>
                      <td>
                        <div className="clearfix">
                          <div className="float-left">
                            <strong>0%</strong>
                          </div>
                          <div className="float-right">
                            <small className="text-muted">Progress</small>
                          </div>
                        </div>
                        <div className="progress progress-xs">
                          <div
                            className="progress-bar bg-azure"
                            role="progressbar"
                            style={{ width: "0%" }}
                            aria-valuenow="42"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>02</td>
                      <td>
                        <h6 className="mb-0">Design Events</h6>
                        <span>
                          It is a long established fact that a reader will be
                          distracted...
                        </span>
                      </td>
                      <td>
                        <ul className="list-unstyled team-info mb-0 w150">
                          {["../assets/images/xs/avatar1.jpg"].map(
                            (src, index) => (
                              <li key={index}>
                                <img
                                  src={src}
                                  data-tooltip-id="team-tooltip"
                                  data-tooltip-content="Team Member"
                                  alt="Avatar"
                                />
                              </li>
                            )
                          )}
                        </ul>
                      </td>
                      <td>
                        <div className="text-info">Start: 02 Jun 2019</div>
                        <div className="text-pink">End: 08 Jun 2019</div>
                      </td>
                      <td>
                        <span className="tag tag-green">Completed</span>
                      </td>
                      <td>
                        <div className="clearfix">
                          <div className="float-left">
                            <strong>100%</strong>
                          </div>
                          <div className="float-right">
                            <small className="text-muted">Progress</small>
                          </div>
                        </div>
                        <div className="progress progress-xs">
                          <div
                            className="progress-bar bg-green"
                            role="progressbar"
                            style={{ width: "100%" }}
                            aria-valuenow="42"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>03</td>
                      <td>
                        <h6 className="mb-0">Feed Details on Dribbble</h6>
                        <span>The point of using Lorem Ipsum is that...</span>
                      </td>
                      <td>
                        <ul className="list-unstyled team-info mb-0 w150">
                          {[
                            "../assets/images/xs/avatar1.jpg",
                            "../assets/images/xs/avatar1.jpg",
                            "../assets/images/xs/avatar1.jpg",
                            "../assets/images/xs/avatar1.jpg",
                          ].map((src, index) => (
                            <li key={index}>
                              <img
                                src={src}
                                data-tooltip-id="team-tooltip"
                                data-tooltip-content="Team Member"
                                alt="Avatar"
                              />
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td>
                        <div className="text-info">Start: 3 Jun 2019</div>
                        <div className="text-pink">End: 15 Jun 2019</div>
                      </td>
                      <td>
                        <span className="tag tag-orange">In progress</span>
                      </td>
                      <td>
                        <div className="clearfix">
                          <div className="float-left">
                            <strong>35%</strong>
                          </div>
                          <div className="float-right">
                            <small className="text-muted">Progress</small>
                          </div>
                        </div>
                        <div className="progress progress-xs">
                          <div
                            className="progress-bar bg-azure"
                            role="progressbar"
                            style={{ width: "35%" }}
                            aria-valuenow="42"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>04</td>
                      <td>
                        <h6 className="mb-0">New code Update on github</h6>
                        <span>
                          It is a long established fact that a reader will be
                          distracted...
                        </span>
                      </td>
                      <td>
                        <ul className="list-unstyled team-info mb-0 w150">
                          {[
                            "../assets/images/xs/avatar1.jpg",
                            "../assets/images/xs/avatar1.jpg",
                            "../assets/images/xs/avatar1.jpg",
                            "../assets/images/xs/avatar1.jpg",
                            "../assets/images/xs/avatar1.jpg",
                          ].map((src, index) => (
                            <li key={index}>
                              <img
                                src={src}
                                data-tooltip-id="team-tooltip"
                                data-tooltip-content="Team Member"
                                alt="Avatar"
                              />
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td>
                        <div className="text-info">Start: 13 Jun 2019</div>
                        <div className="text-pink">End: 23 Jun 2019</div>
                      </td>
                      <td>
                        <span className="tag tag-orange">In progress</span>
                      </td>
                      <td>
                        <div className="clearfix">
                          <div className="float-left">
                            <strong>75%</strong>
                          </div>
                          <div className="float-right">
                            <small className="text-muted">Progress</small>
                          </div>
                        </div>
                        <div className="progress progress-xs">
                          <div
                            className="progress-bar bg-green"
                            role="progressbar"
                            style={{ width: "75%" }}
                            aria-valuenow="42"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>05</td>
                      <td>
                        <h6 className="mb-0">New code Update on github</h6>
                        <span>
                          Contrary to popular belief, Lorem Ipsum is not simply
                          random text.
                        </span>
                      </td>
                      <td>
                        <ul className="list-unstyled team-info mb-0 w150">
                          {[
                            "../assets/images/xs/avatar1.jpg",
                            "../assets/images/xs/avatar1.jpg",
                            "../assets/images/xs/avatar1.jpg",
                            "../assets/images/xs/avatar1.jpg",
                          ].map((src, index) => (
                            <li key={index}>
                              <img
                                src={src}
                                data-tooltip-id="team-tooltip"
                                data-tooltip-content="Team Member"
                                alt="Avatar"
                              />
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td>
                        <div className="text-info">Start: 8 Jun 2019</div>
                        <div className="text-pink">End: 15 Jun 2019</div>
                      </td>
                      <td>
                        <span className="tag tag-orange">In progress</span>
                      </td>
                      <td>
                        <div className="clearfix">
                          <div className="float-left">
                            <strong>35%</strong>
                          </div>
                          <div className="float-right">
                            <small className="text-muted">Progress</small>
                          </div>
                        </div>
                        <div className="progress progress-xs">
                          <div
                            className="progress-bar bg-azure"
                            role="progressbar"
                            style={{ width: "35%" }}
                            aria-valuenow="42"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>06</td>
                      <td>
                        <h6 className="mb-0">Angular App Design bug</h6>
                        <span>
                          There are many variations of passages of Lorem Ipsum
                          available...
                        </span>
                      </td>
                      <td>
                        <ul className="list-unstyled team-info mb-0 w150">
                          {[
                            "../assets/images/xs/avatar1.jpg",
                            "../assets/images/xs/avatar1.jpg",
                            "../assets/images/xs/avatar1.jpg",
                          ].map((src, index) => (
                            <li key={index}>
                              <img
                                src={src}
                                data-tooltip-id="team-tooltip"
                                data-tooltip-content="Team Member"
                                alt="Avatar"
                              />
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td>
                        <div className="text-info">Start: 3 Jun 2019</div>
                        <div className="text-pink">End: 15 Jun 2019</div>
                      </td>
                      <td>
                        <span className="tag tag-orange">Planned</span>
                      </td>
                      <td>
                        <div className="clearfix">
                          <div className="float-left">
                            <strong>35%</strong>
                          </div>
                          <div className="float-right">
                            <small className="text-muted">Progress</small>
                          </div>
                        </div>
                        <div className="progress progress-xs">
                          <div
                            className="progress-bar bg-azure"
                            role="progressbar"
                            style={{ width: "35%" }}
                            aria-valuenow="42"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabPane>

            {/* Tab 2: Scrum Type */}
            <TabPane tabId={2} className={classnames(["fade show"])}>
              <div className="row clearfix">
                <DragDropContext onDragEnd={onDragEnd}>
                  <div className="col-lg-4 col-md-12">
                    <div
                      className={`card planned_task ${
                        isCardRemove ? "card-remove" : ""
                      } ${isFullScreen ? "card-fullscreen" : ""} ${
                        isCollapsed ? "card-collapsed" : ""
                      }`}
                    >
                      <div className="card-header">
                        <h3 className="card-title">Planned</h3>
                        <div className="card-options">
                          <a
                            href="#"
                            className="card-options-collapse"
                            onClick={(e) => {
                              e.preventDefault();
                              setIsCollapsed(!isCollapsed);
                            }}
                          >
                            <i className="fe fe-chevron-up"></i>
                          </a>
                          <a
                            href="#"
                            className="card-options-fullscreen"
                            onClick={(e) => {
                              e.preventDefault();
                              setIsFullScreen(!isFullScreen);
                            }}
                          >
                            <i className="fe fe-maximize"></i>
                          </a>
                          <a
                            href="#"
                            className="card-options-remove"
                            onClick={(e) => {
                              e.preventDefault();
                              setIsCardRemove(!isCardRemove);
                            }}
                          >
                            <i className="fe fe-x"></i>
                          </a>
                          <div className="item-action dropdown ml-2">
                            <a href="#" data-toggle="dropdown">
                              <i className="fe fe-more-vertical"></i>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right">
                              <a href="#" className="dropdown-item">
                                <i className="dropdown-icon fa fa-eye"></i> View
                                Details{" "}
                              </a>
                              <a href="#" className="dropdown-item">
                                <i className="dropdown-icon fa fa-share-alt"></i>{" "}
                                Share{" "}
                              </a>
                              <a href="#" className="dropdown-item">
                                <i className="dropdown-icon fa fa-cloud-download"></i>{" "}
                                Download
                              </a>
                              <div className="dropdown-divider"></div>
                              <a href="#" className="dropdown-item">
                                <i className="dropdown-icon fa fa-copy"></i>{" "}
                                Copy to
                              </a>
                              <a href="#" className="dropdown-item">
                                <i className="dropdown-icon fa fa-folder"></i>{" "}
                                Move to
                              </a>
                              <a href="#" className="dropdown-item">
                                <i className="dropdown-icon fa fa-edit"></i>{" "}
                                Rename
                              </a>
                              <a href="#" className="dropdown-item">
                                <i className="dropdown-icon fa fa-trash"></i>{" "}
                                Delete
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        <DraggableList items={plannedItems} listId="planned" />
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-12">
                    <div className="card progress_task">
                      <div className="card-header">
                        <h3 className="card-title">In progress</h3>
                        <div className="card-options">
                          <a href="#" className="card-options-collapse">
                            <i className="fe fe-chevron-up"></i>
                          </a>
                          <a href="#" className="card-options-fullscreen">
                            <i className="fe fe-maximize"></i>
                          </a>
                          <a href="#" className="card-options-remove">
                            <i className="fe fe-x"></i>
                          </a>
                          <div className="item-action dropdown ml-2">
                            <a href="#" data-toggle="dropdown">
                              <i className="fe fe-more-vertical"></i>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right">
                              <a href="#" className="dropdown-item">
                                <i className="dropdown-icon fa fa-eye"></i> View
                                Details{" "}
                              </a>
                              <a href="#" className="dropdown-item">
                                <i className="dropdown-icon fa fa-share-alt"></i>{" "}
                                Share{" "}
                              </a>
                              <a href="#" className="dropdown-item">
                                <i className="dropdown-icon fa fa-cloud-download"></i>{" "}
                                Download
                              </a>
                              <div className="dropdown-divider"></div>
                              <a href="#" className="dropdown-item">
                                <i className="dropdown-icon fa fa-copy"></i>{" "}
                                Copy to
                              </a>
                              <a href="#" className="dropdown-item">
                                <i className="dropdown-icon fa fa-folder"></i>{" "}
                                Move to
                              </a>
                              <a href="#" className="dropdown-item">
                                <i className="dropdown-icon fa fa-edit"></i>{" "}
                                Rename
                              </a>
                              <a href="#" className="dropdown-item">
                                <i className="dropdown-icon fa fa-trash"></i>{" "}
                                Delete
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        <DraggableList
                          items={progressItems}
                          listId="progress"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-12">
                    <div className="card completed_task">
                      <div className="card-header">
                        <h3 className="card-title">Completed</h3>
                        <div className="card-options">
                          <a href="#" className="card-options-collapse">
                            <i className="fe fe-chevron-up"></i>
                          </a>
                          <a href="#" className="card-options-fullscreen">
                            <i className="fe fe-maximize"></i>
                          </a>
                          <a href="#" className="card-options-remove">
                            <i className="fe fe-x"></i>
                          </a>
                          <div className="item-action dropdown ml-2">
                            <a href="#" data-toggle="dropdown">
                              <i className="fe fe-more-vertical"></i>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right">
                              <a href="#" className="dropdown-item">
                                <i className="dropdown-icon fa fa-eye"></i> View
                                Details{" "}
                              </a>
                              <a href="#" className="dropdown-item">
                                <i className="dropdown-icon fa fa-share-alt"></i>{" "}
                                Share{" "}
                              </a>
                              <a href="#" className="dropdown-item">
                                <i className="dropdown-icon fa fa-cloud-download"></i>{" "}
                                Download
                              </a>
                              <div className="dropdown-divider"></div>
                              <a href="#" className="dropdown-item">
                                <i className="dropdown-icon fa fa-copy"></i>{" "}
                                Copy to
                              </a>
                              <a href="#" className="dropdown-item">
                                <i className="dropdown-icon fa fa-folder"></i>{" "}
                                Move to
                              </a>
                              <a href="#" className="dropdown-item">
                                <i className="dropdown-icon fa fa-edit"></i>{" "}
                                Rename
                              </a>
                              <a href="#" className="dropdown-item">
                                <i className="dropdown-icon fa fa-trash"></i>{" "}
                                Delete
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        <DraggableList
                          items={completedItems}
                          listId="completed"
                        />
                      </div>
                    </div>
                  </div>
                </DragDropContext>
              </div>
            </TabPane>

            {/* Tab 3: Add Task */}
            <TabPane tabId={3} className={classnames(["fade show"])}>
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Add Task</h3>
                  <div className="card-options">
                    <a href="#" className="card-options-collapse">
                      <i className="fe fe-chevron-up"></i>
                    </a>
                    <a href="#" className="card-options-remove">
                      <i className="fe fe-x"></i>
                    </a>
                  </div>
                </div>
                <form className="card-body">
                  <div className="form-group row">
                    <label className="col-md-3 col-form-label">
                      Task no. <span className="text-danger">*</span>
                    </label>
                    <div className="col-md-7">
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-md-3 col-form-label">
                      Job title <span className="text-danger">*</span>
                    </label>
                    <div className="col-md-7">
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-md-3 col-form-label">
                      Select Team <span className="text-danger">*</span>
                    </label>
                    <div className="col-md-7">
                      <select className="form-control">
                        <option>Select</option>
                        <option>John Smith</option>
                        <option>Claire Peters</option>
                        <option>Allen Collins</option>
                        <option>Cory Carter</option>
                        <option>Rochelle Barton</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-md-3 col-form-label">
                      Description <span className="text-danger">*</span>
                    </label>
                    <div className="col-md-7">
                      <textarea
                        rows="4"
                        className="form-control no-resize"
                        placeholder="Please type what you want..."
                      ></textarea>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-md-3 col-form-label">
                      Range <span className="text-danger">*</span>
                    </label>
                    <div className="col-md-7">
                      <div className="input-daterange input-group">
                        <input
                          type="date"
                          className="form-control"
                          name="start"
                        />
                        <div className="input-group-append input-group-prepend">
                          <span className="input-group-text"> to </span>
                        </div>
                        <input
                          type="date"
                          className="form-control"
                          name="end"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-md-3 col-form-label"></label>
                    <div className="col-md-7">
                      <button type="submit" className="mr-1 btn btn-primary">
                        Submit
                      </button>
                      <button
                        type="submit"
                        className="btn btn-outline-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </TabPane>
          </TabContent>
        </div>
      </div>

      {/* Tooltips */}
      <Tooltip id="team-tooltip" />
      <Tooltip id="completed" />
    </>
  );
};

export default TaskBoard;