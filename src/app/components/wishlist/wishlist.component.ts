import { Component, OnInit,ViewChild} from '@angular/core';
import { Wishlist } from '../../models/wishlist';
import { User } from '../../models/user';
import { LoginService } from '../../services/login.service';
import { ProductsService } from '../../services/products.service';
import {MatPaginator, MatSort, MatTableDataSource,VERSION, MatDialog, MatDialogRef} from '@angular/material';
import { Product } from '../../models/product';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  user: User;
  displayedColumns = ['product_id', 'product_name', 'product_type', 'product_price', 'product_quantity', 'wisher_id'];
  dataSource: MatTableDataSource<Product>;
  version = VERSION;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private productService: ProductsService, private dialog: MatDialog, private loginService: LoginService) {

    this.user = loginService.getUser();
    this.productService.getWishList().subscribe(data => {
      data.forEach(d => {
        d.wish_status = this.getOrderStatusText(d.delivery_stauts);
      });

      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
     // console.log("datasource is : "+ this.dataSource);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
  });
  }

  ngOnInit() {
  }



  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  getOrderStatusText(statusCode: String): String {
    switch (statusCode) {
      case 'PE':
        return 'Pending';
      case 'CO':
        return 'Completed';
      case 'DE':
        return 'Rejected';
      default:
        return '-----';
    }
  }







}
