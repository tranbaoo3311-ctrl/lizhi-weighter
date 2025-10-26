from pydantic import BaseModel
from typing import List, Optional
from .models import CustomerLevel, OrderStatus

# Schemas for Product
class ProductBase(BaseModel):
    name: str
    unit: str
    retail_price: float

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    class Config:
        orm_mode = True

# Schemas for Customer
class CustomerBase(BaseModel):
    name: str
    level: CustomerLevel

class CustomerCreate(CustomerBase):
    pass

class Customer(CustomerBase):
    id: int
    is_active: bool
    class Config:
        orm_mode = True

# Schemas for Operator
class OperatorBase(BaseModel):
    username: str

class OperatorCreate(OperatorBase):
    password: str

class Operator(OperatorBase):
    id: int
    is_active: bool
    class Config:
        orm_mode = True

# Schemas for OrderItem
class OrderItemBase(BaseModel):
    product_id: int
    quantity: float

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    id: int
    price_per_unit: float
    class Config:
        orm_mode = True

# Schemas for Order
class OrderBase(BaseModel):
    customer_id: int
    items: List[OrderItemCreate]

class OrderCreate(OrderBase):
    pass

class Order(OrderBase):
    id: int
    status: OrderStatus
    total_amount: float
    items: List[OrderItem] = []
    class Config:
        orm_mode = True

class OrderStatusUpdate(BaseModel):
    status: OrderStatus

# Schemas for PriceRule
class PriceRuleBase(BaseModel):
    product_id: int
    customer_level: CustomerLevel
    price: Optional[float] = None
    discount: Optional[float] = None

class PriceRuleCreate(PriceRuleBase):
    pass

class PriceRule(PriceRuleBase):
    id: int
    class Config:
        orm_mode = True
