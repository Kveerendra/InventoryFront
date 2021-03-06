import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product';
import { User } from '../../models/user';
import { LoginService } from '../../services/login.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TabsetComponent } from 'ngx-bootstrap';
import { EditProductComponent } from '../edit-product/edit-product.component';
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  VERSION,
  MatDialog,
  MatDialogRef
} from '@angular/material';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  user: User;
  displayedColumns;
  dataSource: MatTableDataSource<Product>;
  version = VERSION;
  editProductDialogRef: MatDialogRef<EditProductComponent>;
  tab = 'All';
  modalRef: BsModalRef;
  product: Product;
  @ViewChild('staticTabs') staticTabs: TabsetComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private productService: ProductsService,
    private dialog: MatDialog,
    private loginService: LoginService,
    private modalService: BsModalService
  ) {
    if(this.isSupplier())
    {
      this.displayedColumns = [
        'product_id',
        'product_name',
        'product_description',
        'product_price',
        'product_quantity',
        'delivery_day',
        'actions'
      ];
    }
    else{
      this.displayedColumns = [
        'product_id',
        'product_name',
        'product_description',
        'product_price',
        'product_quantity',
        'delivery_day'
      ];
    }


    this.user = loginService.getUser();
    this.productService.getProducts().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      // console.log('datasource is : ' + this.dataSource);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    console.log("in constructior");
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  ngOnInit() {
    console.log("in init");
  }
  myTab() {
    return this.staticTabs.tabs[1].active !== true;
  }
  addProduct() {
    this.modalRef.hide();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  editItem(product: Product) {
    // console.log('product details :' + product);
    this.productService.changeProduct(product);
    this.editProductDialogRef = this.dialog.open(EditProductComponent);
  }

  isSellersProduct(product: Product): boolean {
    // console.error(product);
    if (product !== undefined) {
      return this.loginService.getUser().username === product.s_user_name;
    } else { return false; }
  }

  isSupplier(): boolean {
    return this.isAuthenticated() && this.loginService.isSeller();
  }
  isAuthenticated(): boolean {
    return this.loginService.authenticated;
  }
}
