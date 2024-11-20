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
    this.refreshFavorites(); // Refrescar favoritos cada vez que la página sea visible
  }

  verificarConexionBD() {
    this.serviceBD.dbReady()
      .pipe(filter(isReady => isReady))
      .subscribe(() => {
        console.log('Base de datos lista.');
        this.getUserSession();
      });
  }

  getUserSession() {
    this.serviceSession.getUserSession().subscribe(async (user) => {
      if (user && user.rut) {
        this.user = user; // Establecer el usuario actual
        console.log('Sesión de usuario obtenida:', user.rut);
        this.favoriteListId = await this.getOrCreateFavoriteList(user.rut); // Obtener o crear lista de favoritos
        this.refreshFavorites(); // Refrescar favoritos al obtener el usuario
      } else {
        console.error('No se encontró una sesión de usuario activa.');
      }
    });
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

  async refreshFavorites() {
    if (!this.favoriteListId) {
      console.error('No hay lista de favoritos para refrescar.');
      return;
    }

    try {
      await this.loadFavorites(); // Recargar los favoritos desde la base de datos
    } catch (error) {
      console.error('Error al refrescar los favoritos:', error);
    }
  }

  async loadFavorites() {
    if (this.favoriteListId) {
      try {
        const favoriteItems = await this.serviceBD.getFavoriteItemsByListId(this.favoriteListId);
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
    } else {
      console.error('No se ha definido un idlist para la lista de favoritos.');
    }
  }

  irPagina(ruta: string) {
    this.router.navigate([ruta]);
  }
}
