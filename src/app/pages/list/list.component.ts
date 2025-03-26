import { Component } from '@angular/core';
import { ContatoService } from '../../services/contato.service';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../components/button/button.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    FormsModule
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
  contatos: any[] = [];
  filteredContatos: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  searchTerm: string = '';
  mostrarApenasFavoritos: boolean = false;
  showEditModal = false;

  selectedContact: any = {
    nome: '',
    email: '',
    celular: '',
    telefone: ''
  };

  constructor(
    private contatoService: ContatoService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  navigateToCadastro() {
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    this.carregarContatos();
  }

  searchByCelular() {
    if (this.searchTerm.trim()) {
      this.contatoService.buscarPorCelular(this.searchTerm.trim()).subscribe({
        next: (contato) => {
          this.filteredContatos = contato ? [contato] : [];
          this.currentPage = 1;
          this.totalPages = Math.ceil(this.filteredContatos.length / this.itemsPerPage);
        },
        error: (error) => {
          this.toastr.error('Erro na busca:', 'Erro');
        }
      });
    } else {
      this.carregarContatos();
    }
  }

  clearSearch() {
    this.searchTerm = '';
    this.carregarContatos();
  }

  carregarContatos(): void {
    this.contatoService.listarContatos().subscribe({
      next: (data) => {
        this.contatos = data;
        this.filteredContatos = [...data];
        this.totalPages = Math.ceil(this.filteredContatos.length / this.itemsPerPage);
      },
      error: (err) => this.toastr.error('Erro ao carregar contatos:', 'Erro')
    });
  }

  toggleFiltroFavoritos() {
    this.mostrarApenasFavoritos = !this.mostrarApenasFavoritos;
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    if (this.mostrarApenasFavoritos) {
      this.filteredContatos = this.contatos.filter(c => c.favorito === 'S');
    } else {
      this.filteredContatos = [...this.contatos];
    }
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredContatos.length / this.itemsPerPage);
  }

  toggleFavorito(id: number) {
    this.contatoService.favoritarContato(id).subscribe({
      next: () => {
        const contato = this.contatos.find(c => c.id === id);
        if (contato) {
          contato.favorito = contato.favorito === 'S' ? 'N' : 'S';
        }
      },
      error: (err) => {
        this.toastr.error('Erro ao favoritar contato', 'Erro');
      }
    });
  }

  alternarStatusContato(id: number) {
    this.contatoService.toggleAtivo(id).subscribe({
      next: () => {
        this.carregarContatos();
      },
      error: (err) => {
        this.toastr.error('Erro ao alterar status:', 'Erro');
      }
    });
  }

  openEditModal(contato: any) {
    this.selectedContact = {
      ...contato,
    };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  saveEditedContact() {
    if (!this.selectedContact.id) {
      this.toastr.error('No contact ID provided for update', 'Erro');
      return;
    }

    const updateData = {
      nome: this.selectedContact.nome,
      email: this.selectedContact.email,
      celular: this.selectedContact.celular,
      telefone: this.selectedContact.telefone
    };

    this.contatoService.atualizarContato(
      this.selectedContact.id,
      updateData
    ).subscribe({
      next: () => {
        this.carregarContatos();
        this.closeEditModal();
      },
      error: (err) => {
        this.toastr.error('Erro ao atualizar contato:', 'Erro');
      }
    });
  }

  get paginatedContatos(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredContatos.slice(startIndex, startIndex + this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  getMinValue(a: number, b: number): number {
    return Math.min(a, b);
  }
}