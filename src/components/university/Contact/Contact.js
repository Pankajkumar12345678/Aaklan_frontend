

import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { TabContent, TabPane, Nav, NavLink, NavItem } from "reactstrap";
import classnames from 'classnames';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

// Custom Tooltip component using Tippy
const Tooltip = ({ content, children }) => (
  <Tippy content={content} placement="top">
    <span>{children}</span>
  </Tippy>
);

// Custom Dropzone component
const Dropzone = () => {
  const [files, setFiles] = useState([]);
  
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles([...files, ...droppedFiles]);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  return (
    <div 
      className="dropzone" 
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{
        border: '2px dashed #ccc',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer'
      }}
    >
      <input 
        type="file" 
        style={{ display: 'none' }} 
        id="fileInput"
        onChange={(e) => setFiles([...files, ...Array.from(e.target.files)])} 
      />
      <label htmlFor="fileInput">
        <div>
          <i className="fa fa-cloud-upload fa-3x mb-3"></i>
          <h4>Drag and drop files here or click to upload</h4>
        </div>
      </label>
      {files.length > 0 && (
        <div className="mt-3">
          <h5>Uploaded files:</h5>
          <ul className="list-unstyled">
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const Contact = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [showAlert, setShowAlert] = useState(false);
  
  const handleDelete = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this imaginary file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        );
      }
    });
  };
  
  const renderContactRow = (contact) => {
    const { starClass, avatar, name, phone, email, address } = contact;
    
    return (
      <tr key={name}>
        <td className="width35 hidden-xs">
          <a href="#" className={`mail-star ${starClass || ''}`}>
            <i className={starClass === 'love' ? 'fa fa-heart' : 'fa fa-star'}></i>
          </a>
        </td>
        <td className="text-center width40">
          <div className="avatar d-block">
            <img className="avatar" src={avatar} alt="Avatar" />
          </div>
        </td>
        <td>
          <div><a href="#">{name}</a></div>
          <div className="text-muted">{phone}</div>
        </td>
        <td className="hidden-xs">
          <div className="text-muted">{email}</div>
        </td>
        <td className="hidden-sm">
          <div className="text-muted">{address}</div>
        </td>
        <td className="text-right">
          <Tooltip content="Phone">
            <a className="btn btn-icon btn-sm" href="#">
              <i className="fa fa-phone"></i>
            </a>
          </Tooltip>
          <Tooltip content="Mail">
            <a className="btn btn-icon btn-sm" href="#">
              <i className="fa fa-envelope"></i>
            </a>
          </Tooltip>
          <Tooltip content="Delete">
            <a 
              onClick={handleDelete} 
              className="btn btn-icon btn-sm text-danger hidden-xs js-sweetalert" 
              href="#"
            >
              <i className="fa fa-trash"></i>
            </a>
          </Tooltip>
        </td>
      </tr>
    );
  };
  
  const contacts = [
    {
      starClass: '',
      avatar: '../assets/images/xs/avatar4.jpg',
      name: 'John Smith',
      phone: '+264-625-2583',
      email: 'johnsmith@info.com',
      address: '455 S. Airport St. Moncks Corner, SC 29461'
    },
    {
      starClass: 'active',
      avatar: '../assets/images/xs/avatar2.jpg',
      name: 'Merri Diamond',
      phone: '+264-625-2583',
      email: 'hermanbeck@info.com',
      address: '455 S. Airport St. Moncks Corner, SC 29461'
    },
    {
      starClass: 'love',
      avatar: '../assets/images/xs/avatar3.jpg',
      name: 'Sara Hopkins',
      phone: '+264-625-3333',
      email: 'maryadams@info.com',
      address: '19 Ohio St. Snellville, GA 30039'
    },
    {
      starClass: 'active',
      avatar: '../assets/images/xs/avatar7.jpg',
      name: 'Andrew Patrick',
      phone: '+264-625-2586',
      email: 'mikethimas@info.com',
      address: '728 Blackburn St. Andover, MA 01810'
    },
    {
      starClass: '',
      avatar: '../assets/images/xs/avatar5.jpg',
      name: 'Claire Peters',
      phone: '+264-625-3333',
      email: 'clairepeters@info.com',
      address: '19 Ohio St. Snellville, GA 30039'
    },
    {
      starClass: '',
      avatar: '../assets/images/xs/avatar6.jpg',
      name: 'Allen Collins',
      phone: '+264-625-4526',
      email: 'kenpatrick@info.com',
      address: '728 Blackburn St. Andover, MA 01810'
    },
    {
      starClass: '',
      avatar: '../assets/images/xs/avatar4.jpg',
      name: 'Erin Gonzales',
      phone: '+264-625-1593',
      email: 'eringonzales@info.com',
      address: '455 S. Airport St. Moncks Corner, SC 29461'
    },
    {
      starClass: '',
      avatar: '../assets/images/xs/avatar5.jpg',
      name: 'Harry McCall',
      phone: '+264-625-2468',
      email: 'susiewillis@info.com',
      address: '19 Ohio St. Snellville, GA 30039'
    }
  ];
  
  const contactCards = [
    {
      image: '../assets/images/sm/avatar1.jpg',
      name: 'Paul Schmidt',
      email: 'Aalizeethomas@info.com',
      statusColor: 'bg-blue',
      contacts: ['../assets/images/xs/avatar1.jpg', '../assets/images/xs/avatar8.jpg', '../assets/images/xs/avatar2.jpg']
    },
    {
      image: '../assets/images/sm/avatar2.jpg',
      name: 'Andrew Patrick',
      email: 'Aalizeethomas@info.com',
      contacts: ['../assets/images/xs/avatar1.jpg', '../assets/images/xs/avatar2.jpg', '../assets/images/xs/avatar3.jpg', '../assets/images/xs/avatar4.jpg']
    },
    {
      image: '../assets/images/sm/avatar3.jpg',
      name: 'Mary Schneider',
      email: 'Aalizeethomas@info.com',
      contacts: ['../assets/images/xs/avatar1.jpg']
    },
    {
      image: '../assets/images/sm/avatar4.jpg',
      name: 'Sean Black',
      email: 'Aalizeethomas@info.com',
      statusColor: 'bg-green',
      contacts: ['../assets/images/xs/avatar2.jpg', '../assets/images/xs/avatar6.jpg', '../assets/images/xs/avatar5.jpg', '../assets/images/xs/avatar7.jpg']
    },
    {
      image: '../assets/images/sm/avatar5.jpg',
      name: 'David Wallace',
      email: 'Aalizeethomas@info.com',
      contacts: ['../assets/images/xs/avatar3.jpg', '../assets/images/xs/avatar4.jpg']
    },
    {
      image: '../assets/images/sm/avatar6.jpg',
      name: 'Andrew Patrick',
      email: 'Aalizeethomas@info.com',
      statusColor: 'bg-pink',
      contacts: ['../assets/images/xs/avatar5.jpg', '../assets/images/xs/avatar6.jpg', '../assets/images/xs/avatar1.jpg']
    },
    {
      image: '../assets/images/sm/avatar2.jpg',
      name: 'Michelle Green',
      email: 'Aalizeethomas@info.com',
      contacts: ['../assets/images/xs/avatar8.jpg', '../assets/images/xs/avatar7.jpg']
    },
    {
      image: '../assets/images/sm/avatar4.jpg',
      name: 'Mary Schneider',
      email: 'Aalizeethomas@info.com',
      contacts: ['../assets/images/xs/avatar2.jpg', '../assets/images/xs/avatar7.jpg']
    }
  ];
  
  return (
    <>
      <div className="section-body">
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center">
            <div className="header-action">
              <h1 className="page-title">Contact</h1>
              <ol className="breadcrumb page-breadcrumb">
                <li className="breadcrumb-item"><a href="#">Ericsson</a></li>
                <li className="breadcrumb-item active" aria-current="page">Contact</li>
              </ol>
            </div>
            
            <Nav tabs className="page-header-tab">
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === 1 })}
                  onClick={() => setActiveTab(1)}
                >
                  <i className="fa fa-list-ul"></i> List
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === 2 })}
                  onClick={() => setActiveTab(2)}
                >
                  <i className="fa fa-th"></i> Grid
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === 3 })}
                  onClick={() => setActiveTab(3)}
                >
                  <i className="fa fa-plus"></i> Add New
                </NavLink>
              </NavItem>
            </Nav>
          </div>
        </div>
      </div>
      
      <div className="section-body mt-4">
        <div className="container-fluid">
          <TabContent activeTab={activeTab}>
            <TabPane tabId={1} className={classnames(['fade show'])}>
              <div className="table-responsive" id="users">
                <table className="table table-hover table-vcenter text-nowrap table_custom list">
                  <tbody>
                    {contacts.map(contact => renderContactRow(contact))}
                  </tbody>
                </table>
              </div>
            </TabPane>
            
            <TabPane tabId={2} className={classnames(['fade show'])}>
              <div className="row row-deck">
                {contactCards.map((card, index) => (
                  <div className="col-xl-4 col-md-6 col-sm-12" key={index}>
                    <div className="card">
                      <div className="card-body">
                        {card.statusColor && <div className={`card-status ${card.statusColor}`}></div>}
                        <div className="mb-3">
                          <img src={card.image} className="rounded-circle w100" alt="" />
                        </div>
                        <div className="mb-2">
                          <h5 className="mb-0">{card.name}</h5>
                          <p className="text-muted">{card.email}</p>
                          <span>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. 
                            Aperiam deleniti fugit incidunt
                          </span>
                        </div>
                        <span className="font-12 text-muted">Common Contact</span>
                        <ul className="list-unstyled team-info margin-0 pt-2">
                          {card.contacts.map((contact, idx) => (
                            <li key={idx}><img src={contact} alt="Avatar" /></li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabPane>
            
            <TabPane tabId={3} className={classnames(['fade show'])}>
              <div className="card">
                <div className="card-body">
                  <div className="row clearfix">
                    <div className="col-lg-4 col-md-12">
                      <div className="form-group">
                        <input type="text" className="form-control" placeholder="Enter Name" />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-12">
                      <div className="form-group">
                        <input type="number" className="form-control" placeholder="Enter Number" />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-12">
                      <div className="form-group">
                        <input type="email" className="form-control" placeholder="Enter Email" />
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                      <div className="form-group">
                        <textarea className="form-control" rows="4" placeholder="Enter your Address"></textarea>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <Dropzone />
                    </div>
                    <div className="col-lg-12 mt-3">
                      <button type="submit" className="mr-1 btn btn-primary">Add</button>
                      <button type="submit" className="btn btn-default">Cancel</button>
                    </div>
                  </div>
                </div>
              </div>
            </TabPane>
          </TabContent>
        </div>
      </div>
    </>
  );
};

export default Contact;