from sqlalchemy.orm import Session
from . import models, schemas
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Product CRUD
def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Product).offset(skip).limit(limit).all()

def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

# Customer CRUD
def get_customer(db: Session, customer_id: int):
    return db.query(models.Customer).filter(models.Customer.id == customer_id).first()

def get_customers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Customer).offset(skip).limit(limit).all()

def create_customer(db: Session, customer: schemas.CustomerCreate):
    db_customer = models.Customer(**customer.dict())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

# Operator CRUD
def get_operator_by_username(db: Session, username: str):
    return db.query(models.Operator).filter(models.Operator.username == username).first()

def create_operator(db: Session, operator: schemas.OperatorCreate):
    hashed_password = pwd_context.hash(operator.password)
    db_operator = models.Operator(username=operator.username, hashed_password=hashed_password)
    db.add(db_operator)
    db.commit()
    db.refresh(db_operator)
    return db_operator

def authenticate_operator(db: Session, username: str, password: str):
    operator = get_operator_by_username(db, username=username)
    if not operator:
        return False
    if not pwd_context.verify(password, operator.hashed_password):
        return False
    return operator

# Order CRUD
def create_order(db: Session, order: schemas.OrderCreate):
    # Fetch customer to determine price level
    customer = get_customer(db, order.customer_id)
    if not customer:
        raise ValueError("Customer not found")

    total_amount = 0
    db_order_items = []

    for item in order.items:
        product = get_product(db, item.product_id)
        if not product:
            raise ValueError(f"Product with id {item.product_id} not found")

        # --- Core Price Calculation Logic ---
        price_rule = db.query(models.PriceRule).filter(
            models.PriceRule.product_id == item.product_id,
            models.PriceRule.customer_level == customer.level
        ).first()

        price_per_unit = product.retail_price
        if price_rule:
            if price_rule.price is not None:
                price_per_unit = price_rule.price
            elif price_rule.discount is not None:
                price_per_unit = product.retail_price * price_rule.discount

        item_total = price_per_unit * item.quantity
        total_amount += item_total

        db_order_items.append(models.OrderItem(
            product_id=item.product_id,
            quantity=item.quantity,
            price_per_unit=price_per_unit
        ))

    db_order = models.Order(
        customer_id=order.customer_id,
        total_amount=total_amount,
        items=db_order_items
    )

    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

# PriceRule CRUD
def create_price_rule(db: Session, price_rule: schemas.PriceRuleCreate):
    db_price_rule = models.PriceRule(**price_rule.dict())
    db.add(db_price_rule)
    db.commit()
    db.refresh(db_price_rule)
    return db_price_rule
