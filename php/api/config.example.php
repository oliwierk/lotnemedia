<?php
/**
 * Konfiguracja panelu. Skopiuj ten plik jako `config.php` i uzupełnij.
 * Plik `config.php` NIE powinien trafić do repozytorium.
 */

declare(strict_types=1);

// Dane logowania do panelu /panel
const ADMIN_USERNAME = 'ilonaptak';
const ADMIN_PASSWORD = 'tu-wpisz-dlugie-losowe-haslo';

// Tłumaczenie PL → EN. Puste = darmowe MyMemory bez klucza.
// Podanie e-maila podnosi dzienny limit MyMemory z 5 tys. do 50 tys. znaków.
const MYMEMORY_EMAIL = '';
// Opcjonalnie lepsza jakość: klucz DeepL (darmowy plan 500 tys. znaków/mies.).
const DEEPL_API_KEY = '';

// Maksymalny rozmiar wgrywanego zdjęcia (w bajtach).
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
