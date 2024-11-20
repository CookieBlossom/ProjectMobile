import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { filter } from 'rxjs';
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

  constructor(
    private router: Router,
    private serviceBD: ServiceBDService,
    private serviceSession: UserSessionService
  ) {}

  ngOnInit() {
    console.log('FavoritesPage loaded');
    this.verificarConexionBD();
  }

  ionViewWillEnter() {
    console.log('FavoritesPage about to enter');
    this.initializeFavorites();
  }

  verificarConexionBD() {
    this.serviceBD.dbReady()
      .pipe(filter(isReady => isReady))
      .subscribe(() => {
        console.log('Base de datos lista.');
        this.serviceBD.searchFavorites(); // Llama al método de búsqueda de favoritos // Llama al método de búsqueda de ítems de favoritos
        this.getUserSession(); // Obtiene la sesión de usuario
      });
  }
  getUserSession() {
    this.serviceSession.getUserSession().subscribe(user => {
      if (user) {
        this.user = user;
        console.log('Sesión de usuario obtenida:', user);
      } else {
        console.error('No se encontró una sesión de usuario activa.');
      }
    });
  }

  async initializeFavorites() {
    if (!this.user || !this.user.rut) {
      console.error('No hay sesión de usuario para inicializar favoritos.');
      return;
    }

    try {
      this.favoriteListId = await this.getOrCreateFavoriteList(this.user.rut);
      if (!this.favoriteListId) {
        console.error('No se pudo obtener o crear la lista de favoritos.');
        return;
      }

      // Cargar los productos favoritos
      await this.loadFavoriteItems(this.favoriteListId);
    } catch (error) {
      console.error('Error al inicializar favoritos:', error);
    }
  }

  async getOrCreateFavoriteList(rut: string): Promise<number | null> {
    try {
      const favoriteList = await this.serviceBD.getFavoriteListByRutAndName(rut, 'Todos');
      if (favoriteList) {
        console.log('Lista de favoritos encontrada:', favoriteList.idlist);
        return favoriteList.idlist;
      }

      const newListId = await this.serviceBD.createFavoriteList(rut, 'Todos');
      if (newListId) {
        console.log('Lista "Todos" creada para el usuario:', rut);
        return newListId;
      }

      return null;
    } catch (error) {
      console.error('Error al obtener o crear la lista de favoritos:', error);
      return null;
    }
  }

  async loadFavoriteItems(idlist: number) {
    try {
      const favoriteItems = await this.serviceBD.getFavoriteItemsByListId(idlist);
      if (favoriteItems) {
        const products: Productos[] = [];
        for (const item of favoriteItems) {
          const product = await this.serviceBD.getProductById(item.idproduct);
          if (product) {
            products.push(product);
          }
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
