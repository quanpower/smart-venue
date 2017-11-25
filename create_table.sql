
--用户
drop table if exists user;
CREATE TABLE USER
    (
        id INT NOT NULL AUTO_INCREMENT,
        user_account VARCHAR(32) NOT NULL,
        user_pwd VARCHAR(32) NOT NULL,
        user_name VARCHAR(64) NOT NULL,
        email VARCHAR(128),
        phone VARCHAR(32) NOT NULL,
        address VARCHAR(256),
        user_type INT NOT NULL,
        sex INT,
        nation VARCHAR(32),
        birthday VARCHAR(10),
        create_time VARCHAR(20) NOT NULL,
        update_time VARCHAR(20),
        state VARCHAR(3) NOT NULL,
        PRIMARY KEY (id)
    )
    ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- 员工
drop table if exists sys_user;
CREATE TABLE SYS_USER
    (
        id INT NOT NULL AUTO_INCREMENT,
        user_account VARCHAR(32) NOT NULL,
        user_pwd VARCHAR(32) NOT NULL,
        user_name VARCHAR(64) NOT NULL,
        user_no VARCHAR(64) NOT NULL,
        email VARCHAR(128),
        phone VARCHAR(32) NOT NULL,
        address VARCHAR(256),
        user_type INT NOT NULL,
        position VARCHAR(32),
        sex INT,
        nation VARCHAR(32),
        birthday VARCHAR(10),
        create_time VARCHAR(20) NOT NULL,
        create_user VARCHAR(20) NOT NULL,
        update_time VARCHAR(20),
        org_id INT,
        state VARCHAR(3) NOT NULL,
        PRIMARY KEY (id)
    )
    ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- 机构
drop table if exists sys_org;
CREATE TABLE sys_org
    (
        id INT NOT NULL AUTO_INCREMENT,
        org_name VARCHAR(128) NOT NULL,
        org_type VARCHAR(3),
        parent_id INT,
        phone VARCHAR(32),
        address VARCHAR(256),
        state VARCHAR(3),
        create_time VARCHAR(20),
        create_user INT,
        update_time VARCHAR(20),
        PRIMARY KEY (id)
    )
    ENGINE=InnoDB DEFAULT CHARSET=utf8


-- 角色
drop table if exists sys_role;
CREATE TABLE sys_role
    (
        id INT NOT NULL AUTO_INCREMENT,
        role_name VARCHAR(60) NOT NULL,
        description VARCHAR(512),
        create_time VARCHAR(20) NOT NULL,
        create_user INT,
        PRIMARY KEY (id)
    )
    ENGINE=InnoDB DEFAULT CHARSET=utf8


-- 员工角色
drop table if exists sys_user_role;
CREATE TABLE sys_user_role
    (
        sys_user_id INT NOT NULL,
        sys_role_id INT NOT NULL,
        create_time VARCHAR(20),
        create_user INT,
        PRIMARY KEY (sys_user_id, sys_role_id)
    )
    ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- 菜单（权限还没想好怎么控制，暂时是通过菜单控制内部员工权限）
drop table if exists sys_menu;
CREATE TABLE sys_menu
    (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(40) NOT NULL,
        parent_id INT,
        url VARCHAR(300),
        icon_name VARCHAR(100),
        sort_index INT,
        create_time VARCHAR(20),
        create_user INT,
        PRIMARY KEY (id)
    )
    ENGINE=InnoDB DEFAULT CHARSET=utf8


-- 角色菜单（权限还没想好怎么控制，暂时是通过菜单控制内部员工权限）
drop table if exists sys_role_menu;
CREATE TABLE sys_role_menu
    (
        role_id INT NOT NULL,
        menu_id INT NOT NULL,
        create_time VARCHAR(20),
        create_user INT,
        PRIMARY KEY (role_id, menu_id)
    )
    ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- 场地
drop table if exists sys_grounds;
CREATE TABLE sys_grounds
    (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(128) NOT NULL,
        description VARCHAR(512),
        config VARCHAR(512),
        picture VARCHAR(256),
        org_id INT NOT NULL,
        type INT NOT NULL,
        create_time VARCHAR(20) NOT NULL,
        create_user INT,
        state VARCHAR(3) NOT NULL,
        PRIMARY KEY (id)
    )
    ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- 预约
drop table if exists booking;
CREATE TABLE booking
    (
        id INT NOT NULL AUTO_INCREMENT,
        user_id INT NOT NULL,
        order_name VARCHAR(128),
        description VARCHAR(512),
        `repeat` VARCHAR(10),
        repeat_date VARCHAR(200),
        start_date VARCHAR(10),
        end_date VARCHAR(10),
        start_time VARCHAR(5),
        end_time VARCHAR(5),
        create_time VARCHAR(20),
        state VARCHAR(3),
        PRIMARY KEY (id)
    )
    ENGINE=InnoDB DEFAULT CHARSET=utf8


-- 预约场地
drop table if exists booking_ground;
CREATE TABLE booking_ground
    (
        booking_id INT NOT NULL,
        ground_id INT NOT NULL,
        booking_date VARCHAR(10),
        create_user INT,
        create_time VARCHAR(20),
        PRIMARY KEY (booking_id, ground_id)
    )
    ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- 场地占用情况（用二进制数每一位代表一个时间段，比如半小时，0为空闲，1为占用，某个场地某天的占用情况即可用一个整数表示）
drop table if exists ground_occupy;
CREATE TABLE ground_occupy
    (
        id INT NOT NULL,
        ground_id INT NOT NULL,
        DATE VARCHAR(10) NOT NULL,
        occupy INT NOT NULL,
        PRIMARY KEY (id)
    )
    ENGINE=InnoDB DEFAULT CHARSET=utf8;