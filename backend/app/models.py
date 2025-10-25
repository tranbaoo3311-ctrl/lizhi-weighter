from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, Enum
from sqlalchemy.orm import relationship
import enum

from .database import Base

class CustomerLevel(enum.Enum):
    NORMAL = "normal"
    VIP = "vip"
    SVIP = "svip"

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    level = Column(Enum(CustomerLevel), default=CustomerLevel.NORMAL)
    is_active = Column(Boolean, default=True)

class Operator(Base):
    __tablename__ = "operators"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    unit = Column(String) # e.g., "kg", "g", "piece"

    # Default price
    retail_price = Column(Float)

import datetime

class PriceRule(Base):
    __tablename__ = "price_rules"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    customer_level = Column(Enum(CustomerLevel))
    price = Column(Float, nullable=True)
    discount = Column(Float, nullable=True) # e.g., 0.9 for 10% off

    product = relationship("Product")

class OrderStatus(enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING)
    total_amount = Column(Float)
    created_at = Column(String, default=datetime.datetime.utcnow)

    customer = relationship("Customer")
    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Float)
    price_per_unit = Column(Float)

    order = relationship("Order", back_populates="items")
    product = relationship("Product")
