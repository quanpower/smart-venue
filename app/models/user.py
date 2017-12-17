import hashlib
from datetime import datetime
from functools import reduce

import bleach
from flask import current_app, url_for
from flask_login import UserMixin, AnonymousUserMixin, current_user
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from markdown import markdown
from werkzeug.security import generate_password_hash, check_password_hash

from app import db, login_manager
from app.exceptions import ValidationError


class NormalUser(UserMixin, db.Model):
    """用户表"""
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    user_account = db.Column(db.String(32), unique=True, index=True)
    password_hash = db.Column(db.String(64), nullable=False)
    confirmed = db.Column(db.Boolean, default=False)  # TODO means?
    user_name = db.Column(db.String(64), nullable=False)
    email = db.Column(db.String(128), unique=True, index=True)
    phone = db.Column(db.String(32), unique=True, index=True)
    emergency_contact = db.Column(db.String(32))
    address = db.Column(db.String(256))
    user_type = db.Column(db.Integer, nullable=False)
    sex = db.Column(db.Integer)
    age = db.Column(db.Integer)
    hobby = db.Column(db.String(256))
    nation = db.Column(db.String(32))
    birthday = db.Column(db.String(10))
    last_login = db.Column(db.DateTime)
    avatar_hash = db.Column(db.String(32))
    state = db.Column(db.String(3), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('sys_role.id'))
    role = db.relationship("SysRole", backref=db.backref('users', lazy='dynamic'), lazy='joined')
    create_time = db.Column(db.DateTime, default=datetime.utcnow)
    update_time = db.Column(db.DateTime)
    created_by = db.Column(db.Integer)
    changed_by = db.Column(db.Integer)

    def __init__(self, **kwargs):
        super(NormalUser, self).__init__(**kwargs)

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def generate_confirmation_token(self, expiration=3600):
        s = Serializer(current_app.config['SECRET_KEY'], expiration)
        return s.dumps({'confirm': self.id}).decode('utf-8')

    def confirm(self, token):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token.encode('utf-8'))
        except:
            return False
        if data.get('confirm') != self.id:
            return False
        self.confirmed = True
        db.session.add(self)
        return True

    @staticmethod
    def reset_password(token, new_password):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token.encode('utf-8'))
        except:
            return False
        user = User.query.get(data.get('reset'))
        if user is None:
            return False
        user.password = new_password
        db.session.add(user)
        return True

    def generate_email_change_token(self, new_email, expiration=3600):
        s = Serializer(current_app.config['SECRET_KEY'], expiration)
        return s.dumps(
            {'change_email': self.id, 'new_email': new_email}).decode('utf-8')

    def change_email(self, token):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token.encode('utf-8'))
        except:
            return False
        if data.get('change_email') != self.id:
            return False
        new_email = data.get('new_email')
        if new_email is None:
            return False
        if self.query.filter_by(email=new_email).first() is not None:
            return False
        self.email = new_email
        self.avatar_hash = self.gravatar_hash()
        db.session.add(self)
        return True

    def can(self, menu):
        if isinstance(menu, int):
            return menu == self.role_id

        if self.role_id is not None:
            role = SysRoleMenu.query.filter_by(role_id=self.role_id, menu_id=menu.id).first()
            return role is not None
        return False

    def gravatar_hash(self):
        return hashlib.md5(self.email.lower().encode('utf-8')).hexdigest()

    def gravatar(self, size=100, default='identicon', rating='g'):
        url = 'https://secure.gravatar.com/avatar'
        hash = self.avatar_hash or self.gravatar_hash()
        return '{url}/{hash}?s={size}&d={default}&r={rating}'.format(
            url=url, hash=hash, size=size, default=default, rating=rating)

    def to_json(self):
        json_user = {
            'url': url_for('api.get_user', id=self.id),
            'username': self.user_name,
            'last_login': self.last_login
        }
        return json_user

    def __repr__(self):
        return '<User %r>' % self.user_name


class SysUser(db.Model):
    """员工表"""
    __tablename__ = "sys_user"
    id = db.Column(db.Integer, primary_key=True)
    user_account = db.Column(db.String(32), unique=True, index=True)
    password_hash = db.Column(db.String(32), nullable=False)
    user_name = db.Column(db.String(64), nullable=False)
    user_no = db.Column(db.Integer, unique=True, index=True, autoincrement=True)
    confirmed = db.Column(db.Boolean, default=False)  # TODO means?
    position = db.Column(db.String(32))
    org_id = db.Column(db.Integer, db.ForeignKey('sys_org.id'))
    org = db.relationship('SysOrg', backref=db.backref('users', lazy='dynamic'), lazy='joined')
    email = db.Column(db.String(128), unique=True, index=True)
    phone = db.Column(db.String(32), nullable=False)
    address = db.Column(db.String(256))
    user_type = db.Column(db.Integer, nullable=False)
    sex = db.Column(db.Integer)
    age = db.Column(db.Integer)
    nation = db.Column(db.String(32))
    birthday = db.Column(db.String(10))
    last_login = db.Column(db.DateTime)
    avatar_hash = db.Column(db.String(32))
    state = db.Column(db.String(3), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('sys_role.id'))
    role = db.relationship("SysRole", backref=db.backref('users', lazy='dynamic'), lazy='joined')
    create_time = db.Column(db.DateTime, default=datetime.utcnow)
    update_time = db.Column(db.DateTime)
    created_by = db.Column(db.Integer)
    changed_by = db.Column(db.Integer)

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def generate_confirmation_token(self, expiration=3600):
        s = Serializer(current_app.config['SECRET_KEY'], expiration)
        return s.dumps({'confirm': self.id}).decode('utf-8')

    def confirm(self, token):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token.encode('utf-8'))
        except:
            return False
        if data.get('confirm') != self.id:
            return False
        self.confirmed = True
        db.session.add(self)
        return True

    @staticmethod
    def reset_password(token, new_password):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token.encode('utf-8'))
        except:
            return False
        user = User.query.get(data.get('reset'))
        if user is None:
            return False
        user.password = new_password
        db.session.add(user)
        return True

    def generate_email_change_token(self, new_email, expiration=3600):
        s = Serializer(current_app.config['SECRET_KEY'], expiration)
        return s.dumps(
            {'change_email': self.id, 'new_email': new_email}).decode('utf-8')

    def change_email(self, token):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token.encode('utf-8'))
        except:
            return False
        if data.get('change_email') != self.id:
            return False
        new_email = data.get('new_email')
        if new_email is None:
            return False
        if self.query.filter_by(email=new_email).first() is not None:
            return False
        self.email = new_email
        self.avatar_hash = self.gravatar_hash()
        db.session.add(self)
        return True

    def can(self, menu):
        if self.role_id is not None:
            role = SysRoleMenu.query.filter_by(role_id=self.role_id, menu_id=menu.id).first()
            return role is not None
        return False

    def gravatar_hash(self):
        return hashlib.md5(self.email.lower().encode('utf-8')).hexdigest()

    def gravatar(self, size=100, default='identicon', rating='g'):
        url = 'https://secure.gravatar.com/avatar'
        hash = self.avatar_hash or self.gravatar_hash()
        return '{url}/{hash}?s={size}&d={default}&r={rating}'.format(
            url=url, hash=hash, size=size, default=default, rating=rating)

    def to_json(self):
        json_user = {
            'url': url_for('api.get_user', id=self.id),
            'username': self.user_name,
            'org_name': self.org.name,
            'last_login': self.last_login
        }
        return json_user

    def __repr__(self):
        return '<User %r>' % self.user_name


class AnonymousUser(AnonymousUserMixin):
    def can(self, permissions):
        return False

    def is_administrator(self):
        return False


login_manager.anonymous_user = AnonymousUser


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


class SysGrounds(db.Model):
    """场地表"""
    __tablename__ = "sys_grounds"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False, unique=True)
    description = db.Column(db.String(512))
    config = db.Column(db.Text)
    picture = db.Column(db.String(256))
    org_id = db.Column(db.Integer, db.ForeignKey('sys_org.id'), nullable=False)
    org = db.relationship("SysOrg", backref=db.backref('grounds', lazy='dynamic'), lazy='joined')
    type = db.Column(db.Integer, nullable=False)
    state = db.Column(db.String(3), nullable=False)
    create_time = db.Column(db.DateTime, default=datetime.utcnow)
    update_time = db.Column(db.DateTime)
    created_by = db.Column(db.Integer)
    changed_by = db.Column(db.Integer)

    def to_json(self):
        json_menu = {
            'url': url_for('api.get_ground', id=self.id),
            'name': self.name,
            'config': self.config,
            'picture': self.picture,
            'org_id': self.org_id,
            'parent_id': self.parent_id
        }
        return json_menu

    def __repr__(self):
        return '<Ground %s> ' % self.name


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
    create_time = db.Column(db.DateTime, default=datetime.utcnow)
    update_time = db.Column(db.DateTime)
    created_by = db.Column(db.Integer)
    changed_by = db.Column(db.Integer)

    def to_json(self):
        json_org = {
            'url': url_for('api.get_org', id=self.id),
            'org_name': self.org_name,
            'parent_id': self.parent_id,
            'org_type': self.org_type
        }
        return json_org

    def __repr__(self):
        return '<Org %r>' % self.org_name


class SysRoleMenu(db.Model):
    """角色菜单权限表"""
    __tablename__ = "sys_role_menu"
    id = db.Column(db.Integer, primary_key=True)
    role_id = db.Column(db.Integer, db.ForeignKey('sys_role.id'))
    menu_id = db.Column(db.Integer, db.ForeignKey('sys_menu.id'))
    create_time = db.Column(db.DateTime, default=datetime.utcnow)
    update_time = db.Column(db.DateTime)
    created_by = db.Column(db.Integer)
    changed_by = db.Column(db.Integer)


class SysRole(db.Model):
    """角色表"""
    __tablename__ = 'sys_role'
    id = db.Column(db.Integer, primary_key=True)
    role_name = db.Column(db.String(60), nullable=False, unique=True)
    permissions = db.relationship('SysRoleMenu',
                                  foreign_keys=[SysRoleMenu.role_id],
                                  backref=db.backref('SysRole', lazy='dynamic'),
                                  lazy='dynamic',
                                  cascade='all, delete-orphan')
    description = db.Column(db.Text)
    create_time = db.Column(db.DateTime, default=datetime.utcnow)
    update_time = db.Column(db.DateTime)
    created_by = db.Column(db.Integer)
    changed_by = db.Column(db.Integer)

    # @staticmethod
    # def insert_roles():
    #     roles = ['User', 'Moderator', 'Administrator']
    #     for r in roles:
    #         role = SysRole.query.filter_by(role_name=r).first()
    #         if role is None:
    #             role = SysRole(role_name=r)
    #         db.session.add(role)
    #     db.session.commit()

    @staticmethod
    def Admin(self):
        # TODO 以往权限管理与login_manager的连接
        return 1

    def add_permission(self, menu):
        if not self.has_permission(menu):
            role_menu = SysRoleMenu(self.id, menu.id, current_user.id)
            db.session.add(role_menu)

    def remove_permission(self, perm):
        # role_menu = self.permissions.filter_by(menu_id=perm.id).first()
        role_menu = SysRoleMenu.query.filter_by(role_id=self.id, menu_id=perm.id).first()
        if role_menu:
            db.session.delete(role_menu)

    # def reset_permissions(self):
    #     self.permissions = None

    def has_permission(self, menu):
        if menu.id is None:
            return False
        # return self.permissions.filter_by(menu_id=menu.id).first() is not None
        return SysRoleMenu.query.filter_by(role_id=self.id, menu_id=menu.id).first() is not None

    def to_json(self):
        json_role = {
            'url': url_for('api.get_role', id=self.id),
            'role_name': self.role_name
        }
        return json_role

    def __repr__(self):
        return '<Role %r>' % self.name


class SysMenu(db.Model):
    """菜单表"""
    __tablename__ = "sys_menu"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(40), nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey('sys_menu.id'))
    parent = db.relationship("SysMenu", backref=db.backref('child', lazy='joined'), lazy='dynamic')
    url = db.Column(db.String(300))
    icon_name = db.Column(db.String(100))
    component = db.Column(db.String(100))
    sort_index = db.Column(db.Integer)
    create_time = db.Column(db.DateTime, default=datetime.utcnow)
    update_time = db.Column(db.DateTime)
    created_by = db.Column(db.Integer)
    changed_by = db.Column(db.Integer)

    def get_sequence(self):
        menu_sequence = [self.id]
        cur = self
        while cur.parent_id is not None:
            parent = SysMenu.query.filter_by(id=cur.parent_id).first()
            if parent is not None:
                menu_sequence.append(parent.id)
                cur = cur.parent
            else:
                break
        menu_sequence.reverse()
        return menu_sequence

    def to_json(self):
        json_menu = {
            'url': url_for('api.get_menu', id=self.id),
            'name': self.name,
            'local_url': self.url,
            'component': self.component,
            'icon_name': self.icon_name,
            'parent_id': self.parent_id
        }
        return json_menu

    def __repr__(self):
        return '<Menu %r>' % self.name


class Booking(db.Model):
    """预约表"""
    __tablename__ = "booking"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship("User", backref=db.backref('booking', lazy='dynamic'), lazy='joined')
    order_name = db.Column(db.String(128))
    description = db.Column(db.String(512))
    repeat_book = db.Column(db.String(10))
    repeat_date = db.Column(db.Text)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    start_time = db.Column(db.Time)
    end_time = db.Column(db.Time)
    state = db.Column(db.String(3))
    create_time = db.Column(db.DateTime, default=datetime.utcnow)
    update_time = db.Column(db.DateTime)
    created_by = db.Column(db.Integer)
    changed_by = db.Column(db.Integer)

    @staticmethod
    def check_occupy(ground_id, mdate, start_time, end_time):
        """
        检查给定时间范围内是否已经有被预约过
        """

        occupy = GroundOccupy.query.filter_by(ground_id=ground_id, date=mdate).first()
        if occupy:
            if occupy.code:
                binary = Booking.get_binary(start_time, end_time)
                result, flag = Booking.compare_bin(binary, occupy.code)
                if not result:
                    return '开始时间冲突' if flag < 0 else ('结束时间冲突' if flag > 0 else '全部时间冲突')
        return ''

    @staticmethod
    def add_booking(ground_id, mdate, start_time, end_time):
        if ground_id == 0:
            return ''
        occupy = GroundOccupy.query.filter_by(ground_id=ground_id, date=mdate).first()
        if not occupy:
            occupy = GroundOccupy()
            occupy.ground_id = ground_id
            occupy.date = mdate
            occupy.code = Booking.get_binary(start_time, end_time)
        else:
            result, flag = Booking.compare_bin(Booking.get_binary(start_time, end_time), occupy.code)
            if result == 0:
                return '时间冲突，添加失败'
            occupy.code = result

        try:
            # with transaction.manager:
            db.session.add(occupy)
            # dbs.flush()
            return ''
        except Exception as e:
            # logger.error(e)
            return '添加占用失败'

    @staticmethod
    def update_booking(old_ground_id, new_ground_id, old_booking, new_booking):
        """
        更新预定
        """

        occupy = None
        if old_ground_id != 0:
            occupy = GroundOccupy.query.filter_by(ground_id=old_ground_id, date=old_booking.start_date).first()
            if occupy:
                old_bin = Booking.get_binary(old_booking.start_time, old_booking.end_time)
                tmp = Booking.delete_bin(old_bin, occupy.code)
                occupy.code = tmp

        if new_ground_id != 0:
            m_bin = Booking.get_binary(new_booking.start_time, new_booking.end_time)
            if old_ground_id == new_ground_id and old_booking.start_date == new_booking.start_date and occupy:
                br_bin = occupy.code
            else:
                occupy = GroundOccupy.query.filter_by(ground_id=new_ground_id, date=new_booking.start_date).first()
                if occupy:
                    br_bin = occupy.code
                else:
                    occupy = GroundOccupy()
                    occupy.room_id = new_ground_id
                    occupy.date = new_booking.start_date
                    br_bin = 0

            result, flag = Booking.compare_bin(m_bin, br_bin)
            if result == 0:
                return '时间冲突，添加失败'
            occupy.code = result
            db.session.add(occupy)
            return ''

    @staticmethod
    def delete_booking(ground_id, mdate, start_time, end_time):
        """
        删除占用
        """
        occupy = GroundOccupy.query.filter_by(ground_id=ground_id, date=mdate).first()
        if not occupy:
            return ''
        else:
            occupy.code = Booking.delete_bin(Booking.get_binary(start_time, end_time), occupy.code)

        try:
            # with transaction.manager:
            if occupy.code == 0:
                db.session.delete(occupy)
            else:
                db.session.merge(occupy)
            # dbs.flush()
            return ''
        except Exception as e:
            # logger.error(e)
            return '删除占用失败'

    # TODO 重复预约，如每周日下午3点到5点

    @staticmethod
    def compare_bin(mt_bin, br_bin):
        """
        比较二进制判断是否有重复
        :param mt_bin: 预约时间范围对应二进制数
        :param br_bin: 预约场地已占用时间范围二进制数
        :return: result: 0 有冲突, 此时flag才有意义;
                         other 新的二进制数;
                 flag:   -1 开始时间冲突;
                         0 全部时间冲突;
                         1 结束时间冲突;
        """
        if isinstance(mt_bin, str):
            mt_bin = int(mt_bin)
        if isinstance(br_bin, str):
            br_bin = int(br_bin)

        if br_bin == 0:
            return mt_bin, 0

        flag = mt_bin & br_bin
        result = 0
        if mt_bin == br_bin or flag == mt_bin or flag == br_bin:
            flag = 0
        elif flag:
            if flag < mt_bin < br_bin:
                flag = 1
            elif flag < br_bin < mt_bin:
                flag = -1
        else:
            result = mt_bin | br_bin
        return result, flag

    @staticmethod
    def delete_bin(mt_bin, br_bin):
        """
        删除预约时,清除此场地的占用值
        :param mt_bin:
        :param br_bin:
        :return:
        """

        result, flag = Booking.compare_bin(mt_bin, br_bin)
        return (mt_bin ^ br_bin) if result == 0 and flag == 0 else br_bin

    @staticmethod
    def get_binary(start_time, end_time, start=7, hours=14):
        """
        根据时间范围生成梳型二进制数对应整形数
        :param start_time: 开始时间
        :param end_time: 结束时间
        :param start: 允许预订的最早时间
        :param hours: 允许预订的时间长度
        :return: -1: 超出时间范围, other int:
        """

        s_h, s_m = start_time.split(':')
        e_h, e_m = end_time.split(':')

        left = (int(s_h) - start) * 2 + (int(s_m) // 30)
        right = (int(e_h) - start) * 2 + (int(e_m) // 30)

        if left < 0 or (right > hours * 2):
            return -1

        binary = reduce((lambda x, y: x + 2 ** y), range(left, right), 0)
        return binary

    def __repr__(self):
        return '<Booking %s>' % self.order_name


class BookingGround(db.Model):
    """预约场地表"""
    __tablename__ = "booking_ground"
    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('booking.id'))
    booking = db.relationship('Booking', backref=db.backref('grounds', lazy='dynamic'), lazy='dynamic')
    ground_id = db.Column(db.Integer, db.ForeignKey('sys_grounds.id'))
    ground = db.relationship('SysGrounds', backref=db.backref('bookings', lazy='dynamic'), lazy='dynamic')
    booking_date = db.Column(db.Date)
    create_time = db.Column(db.DateTime, default=datetime.utcnow)
    update_time = db.Column(db.DateTime)
    created_by = db.Column(db.Integer)
    changed_by = db.Column(db.Integer)


class GroundOccupy(db.Model):
    """场地占用情况"""
    __tablename__ = "ground_occupy"
    id = db.Column(db.Integer, primary_key=True)
    ground_id = db.Column(db.Integer, db.ForeignKey('sys_grounds.id'), nullable=False)
    ground = db.relationship('SysGrounds', backref=db.backref('occupies', lazy='dynamic'), lazy='dynamic')
    date = db.Column(db.Date, nullable=False)
    occupy = db.Column(db.Integer, nullable=False)
    create_time = db.Column(db.DateTime, default=datetime.utcnow)
    update_time = db.Column(db.DateTime)
    created_by = db.Column(db.Integer)
    changed_by = db.Column(db.Integer)

    def __repr__(self):
        return '<GroundOccupy %s >' % str(self.occupy)


class Permission:
    FOLLOW = 1
    COMMENT = 2
    WRITE = 4
    MODERATE = 8
    ADMIN = 16


class Role(db.Model):
    __tablename__ = 'roles'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True)
    default = db.Column(db.Boolean, default=False, index=True)
    permissions = db.Column(db.Integer)
    users = db.relationship('User', backref='role', lazy='dynamic')

    def __init__(self, **kwargs):
        super(Role, self).__init__(**kwargs)
        if self.permissions is None:
            self.permissions = 0

    @staticmethod
    def insert_roles():
        roles = {
            'User': [Permission.FOLLOW, Permission.COMMENT, Permission.WRITE],
            'Moderator': [Permission.FOLLOW, Permission.COMMENT,
                          Permission.WRITE, Permission.MODERATE],
            'Administrator': [Permission.FOLLOW, Permission.COMMENT,
                              Permission.WRITE, Permission.MODERATE,
                              Permission.ADMIN],
        }
        default_role = 'User'
        for r in roles:
            role = Role.query.filter_by(name=r).first()
            if role is None:
                role = Role(name=r)
            role.reset_permissions()
            for perm in roles[r]:
                role.add_permission(perm)
            role.default = (role.name == default_role)
            db.session.add(role)
        db.session.commit()

    def add_permission(self, perm):
        if not self.has_permission(perm):
            self.permissions += perm

    def remove_permission(self, perm):
        if self.has_permission(perm):
            self.permissions -= perm

    def reset_permissions(self):
        self.permissions = 0

    def has_permission(self, perm):
        return self.permissions & perm == perm

    def __repr__(self):
        return '<Role %r>' % self.name


class Follow(db.Model):
    __tablename__ = 'follows'
    follower_id = db.Column(db.Integer, db.ForeignKey('users.id'),
                            primary_key=True)
    followed_id = db.Column(db.Integer, db.ForeignKey('users.id'),
                            primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)


class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(64), unique=True, index=True)
    username = db.Column(db.String(64), unique=True, index=True)
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))
    password_hash = db.Column(db.String(128))
    confirmed = db.Column(db.Boolean, default=False)
    name = db.Column(db.String(64))
    location = db.Column(db.String(64))
    about_me = db.Column(db.Text())
    member_since = db.Column(db.DateTime(), default=datetime.utcnow)
    last_seen = db.Column(db.DateTime(), default=datetime.utcnow)
    avatar_hash = db.Column(db.String(32))
    posts = db.relationship('Post', backref='author', lazy='dynamic')
    followed = db.relationship('Follow',
                               foreign_keys=[Follow.follower_id],
                               backref=db.backref('follower', lazy='joined'),
                               lazy='dynamic',
                               cascade='all, delete-orphan')
    followers = db.relationship('Follow',
                                foreign_keys=[Follow.followed_id],
                                backref=db.backref('followed', lazy='joined'),
                                lazy='dynamic',
                                cascade='all, delete-orphan')
    comments = db.relationship('Comment', backref='author', lazy='dynamic')

    @staticmethod
    def add_self_follows():
        for user in User.query.all():
            if not user.is_following(user):
                user.follow(user)
                db.session.add(user)
                db.session.commit()

    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)
        if self.role is None:
            if self.email == current_app.config['FLASKY_ADMIN']:
                self.role = Role.query.filter_by(name='Administrator').first()
            if self.role is None:
                self.role = Role.query.filter_by(default=True).first()
        if self.email is not None and self.avatar_hash is None:
            self.avatar_hash = self.gravatar_hash()
        self.follow(self)

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def generate_confirmation_token(self, expiration=3600):
        s = Serializer(current_app.config['SECRET_KEY'], expiration)
        return s.dumps({'confirm': self.id}).decode('utf-8')

    def confirm(self, token):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token.encode('utf-8'))
        except:
            return False
        if data.get('confirm') != self.id:
            return False
        self.confirmed = True
        db.session.add(self)
        return True

    def generate_reset_token(self, expiration=3600):
        s = Serializer(current_app.config['SECRET_KEY'], expiration)
        return s.dumps({'reset': self.id}).decode('utf-8')

    @staticmethod
    def reset_password(token, new_password):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token.encode('utf-8'))
        except:
            return False
        user = User.query.get(data.get('reset'))
        if user is None:
            return False
        user.password = new_password
        db.session.add(user)
        return True

    def generate_email_change_token(self, new_email, expiration=3600):
        s = Serializer(current_app.config['SECRET_KEY'], expiration)
        return s.dumps(
            {'change_email': self.id, 'new_email': new_email}).decode('utf-8')

    def change_email(self, token):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token.encode('utf-8'))
        except:
            return False
        if data.get('change_email') != self.id:
            return False
        new_email = data.get('new_email')
        if new_email is None:
            return False
        if self.query.filter_by(email=new_email).first() is not None:
            return False
        self.email = new_email
        self.avatar_hash = self.gravatar_hash()
        db.session.add(self)
        return True

    def can(self, perm):
        return self.role is not None and self.role.has_permission(perm)

    def is_administrator(self):
        return self.can(Permission.ADMIN)

    def ping(self):
        self.last_seen = datetime.utcnow()
        db.session.add(self)

    def gravatar_hash(self):
        return hashlib.md5(self.email.lower().encode('utf-8')).hexdigest()

    def gravatar(self, size=100, default='identicon', rating='g'):
        url = 'https://secure.gravatar.com/avatar'
        hash = self.avatar_hash or self.gravatar_hash()
        return '{url}/{hash}?s={size}&d={default}&r={rating}'.format(
            url=url, hash=hash, size=size, default=default, rating=rating)

    def follow(self, user):
        if not self.is_following(user):
            f = Follow(follower=self, followed=user)
            db.session.add(f)

    def unfollow(self, user):
        f = self.followed.filter_by(followed_id=user.id).first()
        if f:
            db.session.delete(f)

    def is_following(self, user):
        if user.id is None:
            return False
        return self.followed.filter_by(
            followed_id=user.id).first() is not None

    def is_followed_by(self, user):
        if user.id is None:
            return False
        return self.followers.filter_by(
            follower_id=user.id).first() is not None

    @property
    def followed_posts(self):
        return Post.query.join(Follow, Follow.followed_id == Post.author_id) \
            .filter(Follow.follower_id == self.id)

    def to_json(self):
        json_user = {
            'url': url_for('api.get_user', id=self.id),
            'username': self.username,
            'member_since': self.member_since,
            'last_seen': self.last_seen,
            'posts_url': url_for('api.get_user_posts', id=self.id),
            'followed_posts_url': url_for('api.get_user_followed_posts',
                                          id=self.id),
            'post_count': self.posts.count()
        }
        return json_user

    def generate_auth_token(self, expiration):
        s = Serializer(current_app.config['SECRET_KEY'],
                       expires_in=expiration)
        return s.dumps({'id': self.id}).decode('utf-8')

    @staticmethod
    def verify_auth_token(token):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except:
            return None
        return User.query.get(data['id'])

    def __repr__(self):
        return '<User %r>' % self.username


class AnonymousUser(AnonymousUserMixin):
    def can(self, permissions):
        return False

    def is_administrator(self):
        return False


login_manager.anonymous_user = AnonymousUser


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


class Post(db.Model):
    __tablename__ = 'posts'
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.Text)
    body_html = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    comments = db.relationship('Comment', backref='post', lazy='dynamic')

    @staticmethod
    def on_changed_body(target, value, oldvalue, initiator):
        allowed_tags = ['a', 'abbr', 'acronym', 'b', 'blockquote', 'code',
                        'em', 'i', 'li', 'ol', 'pre', 'strong', 'ul',
                        'h1', 'h2', 'h3', 'p']
        target.body_html = bleach.linkify(bleach.clean(
            markdown(value, output_format='html'),
            tags=allowed_tags, strip=True))

    def to_json(self):
        json_post = {
            'url': url_for('api.get_post', id=self.id),
            'body': self.body,
            'body_html': self.body_html,
            'timestamp': self.timestamp,
            'author_url': url_for('api.get_user', id=self.author_id),
            'comments_url': url_for('api.get_post_comments', id=self.id),
            'comment_count': self.comments.count()
        }
        return json_post

    @staticmethod
    def from_json(json_post):
        body = json_post.get('body')
        if body is None or body == '':
            raise ValidationError('post does not have a body')
        return Post(body=body)


db.event.listen(Post.body, 'set', Post.on_changed_body)


class Comment(db.Model):
    __tablename__ = 'comments'
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.Text)
    body_html = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    disabled = db.Column(db.Boolean)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))

    @staticmethod
    def on_changed_body(target, value, oldvalue, initiator):
        allowed_tags = ['a', 'abbr', 'acronym', 'b', 'code', 'em', 'i',
                        'strong']
        target.body_html = bleach.linkify(bleach.clean(
            markdown(value, output_format='html'),
            tags=allowed_tags, strip=True))

    def to_json(self):
        json_comment = {
            'url': url_for('api.get_comment', id=self.id),
            'post_url': url_for('api.get_post', id=self.post_id),
            'body': self.body,
            'body_html': self.body_html,
            'timestamp': self.timestamp,
            'author_url': url_for('api.get_user', id=self.author_id),
        }
        return json_comment

    @staticmethod
    def from_json(json_comment):
        body = json_comment.get('body')
        if body is None or body == '':
            raise ValidationError('comment does not have a body')
        return Comment(body=body)


db.event.listen(Comment.body, 'set', Comment.on_changed_body)
