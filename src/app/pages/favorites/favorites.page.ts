import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Productos } from 'src/app/services/productos';
import { ServiceBDService } from 'src/app/services/service-bd.service';
import { UserSessionService } from 'src/app/services/user-session.service';
import { Users } from 'src/app/services/users';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {
  productsFavorite: Productos[] = [];
  user: Users | null = null;
  favoriteListId: number | null = null;
  constructor(private router: Router,private serviceBD: ServiceBDService,private serviceSession: UserSessionService) {}
  ngOnInit() {
    this.loadUserData();
  }
  loadUserData() {
    this.serviceSession.getUserSession().subscribe({
      next: (userSession) => {
        if (userSession?.rut) { // Asegúrate de que el 'rut' esté presente
          console.log('Sesión de usuario recuperada:', userSession);
          this.user = userSession; // Guarda la sesión completa
          this.checkFavoriteList(); // Llama a verificar la lista de favoritos
        } else {
          console.error('La sesión no contiene un RUT válido.');
        }
      },
      error: (err) => {
        console.error('Error al obtener la sesión del usuario:', err);
      },
    });
  }

  async checkFavoriteList() {
    if (this.user) {
      try {
        const res = await this.serviceBD.getFavoriteListByRutAndName(this.user.rut, 'Todos');
        if (res) {
          console.log('Lista de favoritos "Todos" encontrada:', res);
          this.favoriteListId = res.idlist;
        } else {
          this.favoriteListId = await this.createFavoriteList(this.user.rut, 'Todos');
          console.log('Lista "Todos" creada con ID:', this.favoriteListId);
        }
        this.loadFavoriteItems(this.favoriteListId!);
      } catch (error) {
        console.error('Error al verificar o crear la lista "Todos":', error);
      }
    }
  }
  async createFavoriteList(rut: string, listName: string): Promise<number | null> {
    try {
      const newListId = await this.serviceBD.createFavoriteList(rut, listName);
      return newListId;
    } catch (error) {
      console.error('Error al crear la lista "Todos":', error);
      return null;
    }
  }

  async loadFavoriteItems(idlist: number) {
    try {
      const favoriteItems = await this.serviceBD.getFavoriteItemsByListId(idlist);
      if (favoriteItems) {
        let products: Productos[] = [];
        for (let item of favoriteItems) {
          const product = await this.serviceBD.getProductById(item.idproduct);
          if (product) {products.push(product);}
        }
        this.productsFavorite = products;
        console.log('Productos favoritos cargados:', this.productsFavorite);
      }
    } catch (error) {
      console.error('Error al cargar los productos favoritos:', error);
    }
  }
  irPagina(ruta: string) {
    this.router.navigate([ruta]);
  }
}
