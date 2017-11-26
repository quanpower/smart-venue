# -.- coding:utf-8 -.-
# __author__ = 'cuizc'
from . import db


class User(db.Model):
    """用户表"""
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    user_account = db.Column(db.String(32), nullable=False)
    user_pwd = db.Column(db.String(32), nullable=False)
    user_name = db.Column(db.String(64), nullable=False)
    email = db.Column(db.String(128))
    phone = db.Column(db.String(32), nullable=False)
    emergency_contact = db.Column(db.String(32))
    address = db.Column(db.String(256))
    user_type = db.Column(db.Integer, nullable=False)
    sex = db.Column(db.Integer)
    age = db.Column(db.Integer)
    hobby = db.Column(db.String(256))
    nation = db.Column(db.String(32))
    birthday = db.Column(db.String(10))
    create_time = db.Column(db.String(20))
    update_time = db.Column(db.String(20))
    created_by = db.Column(db.Integer)
    changed_by = db.Column(db.Integer)
    state = db.Column(db.String(3), nullable=False)

    def __repr__(self):
        return self.user_name


class SysUser(db.Model):
    """员工表"""
    __tablename__ = "sys_user"
    id = db.Column(db.Integer, primary_key=True)
    user_account = db.Column(db.String(32), nullable=False)
    user_pwd = db.Column(db.String(32), nullable=False)
    user_name = db.Column(db.String(64), nullable=False)
    user_no = db.Column(db.String(64), nullable=False)
    position = db.Column(db.String(32))
    org_id = db.Column(db.Integer)
    email = db.Column(db.String(128))
    phone = db.Column(db.String(32), nullable=False)
    address = db.Column(db.String(256))
    user_type = db.Column(db.Integer, nullable=False)
    sex = db.Column(db.Integer)
    age = db.Column(db.Integer)
    nation = db.Column(db.String(32))
    birthday = db.Column(db.String(10))
    create_time = db.Column(db.String(20))
    update_time = db.Column(db.String(20))
    created_by = db.Column(db.Integer)
    changed_by = db.Column(db.Integer)
    state = db.Column(db.String(3), nullable=False)

    def __repr__(self):
        return self.user_name


class SysOrg(db.Model):
    """机构表"""
    __tablename__ = "sys_org"
    id = db.Column(db.Integer, primary_key=True)
    org_name = db.Column(db.String(128), nullable=False)
    org_type = db.Column(db.String(3))
    parent_id = db.Column(db.Integer)
    phone = db.Column(db.String(20))
    address = db.Column(db.String(256))
    state = db.Column(db.String(3))
    create_time = db.Column(db.String(20))
    update_time = db.Column(db.String(20))
    created_by = db.Column(db.Integer)
    changed_by = db.Column(db.Integer)

    def __repr__(self):
        return self.org_name


class SysRole(db.Model):
    """角色表"""
    __tablename__ = "sys_role"
    id = db.Column(db.Integer, primary_key=True)
    role_name = db.Column(db.String(60), nullable=False)
    description = db.Column(db.String(512))
    create_time = db.Column(db.String(20))
    update_time = db.Column(db.String(20))
    created_by = db.Column(db.Integer)
    changed_by = db.Column(db.Integer)

    def __repr__(self):
        return self.role_name


class SysMenu(db.Model):
    """菜单表"""
    __tablename__ = "sys_menu"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(40), nullable=False)
    parent_id = db.Column(db.Integer)
    url = db.Column(db.String(300))
    icon_name = db.Column(db.String(100))
    component = db.Column(db.String(100))
    sort_index = db.Column(db.Integer)
    create_time = db.Column(db.String(20))
    update_time = db.Column(db.String(20))
    created_by = db.Column(db.Integer)
    changed_by = db.Column(db.Integer)

    def __repr__(self):
        return self.name


class SysRoleMenu(db.Model):
    """角色菜单权限表"""
    __tablename__ = "sys_role_menu"
    role_id = db.Column(db.Integer, primary_key=True, nullable=False)
    menu_id = db.Column(db.Integer, primary_key=True, nullable=False)
    create_time = db.Column(db.String(20))
    update_time = db.Column(db.String(20))
    created_by = db.Column(db.Integer)
    changed_by = db.Column(db.Integer)


class SysGrounds(db.Model):
    """场地表"""
    __tablename__ = "sys_grounds"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    description = db.Column(db.String(512))
    config = db.Column(db.String(512))
    picture = db.Column(db.String(256))
    org_id = db.Column(db.Integer, nullable=False)
    type = db.Column(db.Integer, nullable=False)
    state = db.Column(db.String(3), nullable=False)
    create_time = db.Column(db.String(20))
    update_time = db.Column(db.String(20))
    created_by = db.Column(db.Integer)
    changed_by = db.Column(db.Integer)

    def __repr__(self):
        return self.name


class Booking(db.Model):
    """预约表"""
    __tablename__ = "booking"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    order_name = db.Column(db.String(128))
    description = db.Column(db.String(512))
    repeat_book = db.Column(db.String(10))
    repeat_date = db.Column(db.String(200))
    start_date = db.Column(db.String(10))
    end_date = db.Column(db.String(10))
    start_time = db.Column(db.String(5))
    end_time = db.Column(db.String(5))
    state = db.Column(db.String(3))
    create_time = db.Column(db.String(20))
    update_time = db.Column(db.String(20))
    created_by = db.Column(db.Integer)
    changed_by = db.Column(db.Integer)

    def __repr__(self):
        return self.order_name


class BookingGround(db.Model):
    """预约场地表"""
    __tablename__ = "booking_ground"
    booking_id = db.Column(db.Integer, primary_key=True)
    ground_id = db.Column(db.Integer, primary_key=True)
    booking_date = db.Column(db.String(10))
    create_time = db.Column(db.String(20))
    update_time = db.Column(db.String(20))
    created_by = db.Column(db.Integer)
    changed_by = db.Column(db.Integer)


class GroundOccupy(db.Model):
    """场地占用情况"""
    __tablename__ = "ground_occupy"
    id = db.Column(db.Integer, primary_key=True)
    ground_id = db.Column(db.Integer, nullable=False)
    date = db.Column(db.String(10), nullable=False)
    occupy = db.Column(db.Integer, nullable=False)
    create_time = db.Column(db.String(20))
    update_time = db.Column(db.String(20))
    created_by = db.Column(db.Integer)
    changed_by = db.Column(db.Integer)

    def __repr__(self):
        return self.occupy
