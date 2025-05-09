import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  FlatList,
  Image,
  Animated,
  ActivityIndicator,
  SafeAreaView,
  Platform
} from 'react-native';
import Video from 'react-native-video';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');

export default function HomePage({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [movieResults, setMovieResults] = useState([]);
  const [tvResults, setTvResults] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [noResults, setNoResults] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollX = useRef(new Animated.Value(0)).current;
  const carouselRef = useRef(null);

  // Kullanıcı oturum kontrolü
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.replace('Login');
      } else {
        setLoading(false);
      }
    };
    
    checkToken();
  }, [navigation]);

  // Popüler filmleri çekme
  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const response = await axios.get('http://10.0.2.2:5000/api/tmdb/popular/movies');
        setPopularMovies(response.data);
      } catch (error) {
        console.error('Error fetching popular movies:', error);
      }
    };
    
    fetchPopularMovies();
  }, []);

  // Otomatik kaydırma efekti
  useEffect(() => {
    if (!popularMovies.length || isHovered || isScrolling) return;

    const interval = setInterval(() => {
      if (carouselRef.current) {
        carouselRef.current.scrollToOffset({
          offset: scrollX._value + 300,
          animated: true
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [popularMovies.length, isHovered, isScrolling, scrollX]);

  // Elle kaydırma fonksiyonları
  const scrollCarousel = (direction) => {
    setIsScrolling(true);
    
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      carouselRef.current.scrollToOffset({
        offset: scrollX._value + scrollAmount,
        animated: true
      });
    }

    setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert('Lütfen arama yapmak için bir şeyler yazın');
      return;
    }

    let movies = [];
    let tvs = [];

    try {
      const movieResponse = await axios.get(`http://10.0.2.2:5000/api/tmdb/search/movies?query=${searchQuery}`);
      movies = movieResponse.data;
    } catch (err) {
      console.warn('Film arama başarısız:', err.message);
    }

    try {
      const tvResponse = await axios.get(`http://10.0.2.2:5000/api/tmdb/search/tv?query=${searchQuery}`);
      tvs = tvResponse.data;
    } catch (err) {
      console.warn('Dizi arama başarısız:', err.message);
    }

    setMovieResults(movies);
    setTvResults(tvs);
    setNoResults(movies.length === 0 && tvs.length === 0);
  };

  // Çıkış fonksiyonu
  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login');
  };

  // Film/detay sayfasına yönlendirme
  const openMovieDetails = (item) => {
    const mediaType = item.title ? 'movie' : 'tv';
    navigation.navigate('Details', { id: item.id, mediaType });
  };

  // Poster URL'si oluşturma
  const getPosterUrl = (path) => {
    return path 
      ? { uri: `https://image.tmdb.org/t/p/w500${path}` }
      : require('../assets/no-poster.jpg');
  };

  // Carousel öğesi render fonksiyonu
  const renderCarouselItem = ({ item, index }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width
    ];
    
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: 'clamp'
    });

    return (
      <Animated.View style={[styles.carouselItem, { transform: [{ scale }] }]}>
        <TouchableOpacity onPress={() => openMovieDetails(item)}>
          <Image
            source={getPosterUrl(item.poster_path)}
            style={styles.carouselImage}
            resizeMode="cover"
          />
          <View style={styles.carouselTextContainer}>
            <Text style={styles.carouselTitle} numberOfLines={1}>{item.title || item.name}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{item.vote_average?.toFixed(1)}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Sonuç öğesi render fonksiyonu
  const renderResultItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.resultItem}
      onPress={() => openMovieDetails(item)}
    >
      <Image
        source={getPosterUrl(item.poster_path)}
        style={styles.resultImage}
        resizeMode="cover"
      />
      <Text style={styles.resultTitle} numberOfLines={1}>{item.title || item.name}</Text>
      <View style={styles.mediaTypeContainer}>
        <Text style={styles.mediaTypeText}>
          {item.title ? 'Film' : 'Dizi'}
        </Text>
      </View>
      <View style={[styles.ratingContainer, styles.resultRating]}>
        <Icon name="star" size={12} color="#FFD700" />
        <Text style={styles.ratingText}>{item.vote_average?.toFixed(1)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E50914" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Arkaplan videosu */}
      <Video
        source={require('../assets/videos/background.mp4')}
        style={styles.backgroundVideo}
        muted
        repeat
        resizeMode="cover"
        rate={1.0}
        ignoreSilentSwitch="obey"
      />

      <ScrollView style={styles.contentContainer}>
        {/* Başlık ve hoşgeldin mesajı */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>CineSearch</Text>
          <Text style={styles.headerSubtitle}>Binlerce film ve dizi keşfetmeye hazır olun</Text>
        </View>

        {/* Popüler filmler carousel */}
        <View style={styles.carouselWrapper}>
          <Animated.FlatList
            ref={carouselRef}
            data={popularMovies}
            renderItem={renderCarouselItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
            contentContainerStyle={styles.carouselContent}
          />
          
          <View style={styles.carouselNav}>
            <TouchableOpacity 
              style={styles.navButton}
              onPress={() => scrollCarousel('left')}
            >
              <Icon name="chevron-left" size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.navButton}
              onPress={() => scrollCarousel('right')}
            >
              <Icon name="chevron-right" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Arama bölümü */}
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Film veya dizi adı girin..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={handleSearch}
          >
            <Icon name="search" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Arama sonuçları */}
        {(movieResults.length > 0 || tvResults.length > 0) ? (
          <View style={styles.resultsSection}>
            {/* Film sonuçları */}
            {movieResults.length > 0 && (
              <View style={styles.resultsCategory}>
                <Text style={styles.resultsTitle}>
                  Film Sonuçları ({movieResults.length})
                </Text>
                <FlatList
                  data={movieResults}
                  renderItem={renderResultItem}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={2}
                  columnWrapperStyle={styles.resultsGrid}
                  contentContainerStyle={styles.resultsContent}
                />
              </View>
            )}

            {/* Dizi sonuçları */}
            {tvResults.length > 0 && (
              <View style={styles.resultsCategory}>
                <Text style={styles.resultsTitle}>
                  Dizi Sonuçları ({tvResults.length})
                </Text>
                <FlatList
                  data={tvResults}
                  renderItem={renderResultItem}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={2}
                  columnWrapperStyle={styles.resultsGrid}
                  contentContainerStyle={styles.resultsContent}
                />
              </View>
            )}
          </View>
        ) : (
          noResults === true && (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>
                Aradığınız içerik bulunamadı.
              </Text>
            </View>
          )
        )}
      </ScrollView>

      {/* Çıkış butonu */}
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Icon name="sign-out" size={20} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.3,
  },
  contentContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#141414',
  },
  loadingText: {
    color: '#FFF',
    marginTop: 20,
    fontSize: 16,
  },
  headerContainer: {
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E5E5E5',
    textAlign: 'center',
  },
  carouselWrapper: {
    height: height * 0.35,
    marginVertical: 20,
    position: 'relative',
  },
  carouselContent: {
    paddingHorizontal: 20,
  },
  carouselItem: {
    width: width * 0.6,
    height: height * 0.3,
    marginRight: 15,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#222',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  carouselTextContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  carouselTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  carouselNav: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    transform: [{ translateY: -20 }],
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 30,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#000',
  },
  searchButton: {
    backgroundColor: '#E50914',
    borderRadius: 8,
    padding: 15,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsSection: {
    paddingHorizontal: 15,
    marginBottom: 30,
  },
  resultsCategory: {
    marginBottom: 25,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 15,
    paddingBottom: 5,
    borderBottomWidth: 3,
    borderBottomColor: '#E50914',
  },
  resultsGrid: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  resultsContent: {
    paddingBottom: 20,
  },
  resultItem: {
    width: width * 0.45,
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#222',
  },
  resultImage: {
    width: '100%',
    height: height * 0.25,
  },
  resultTitle: {
    color: '#FFF',
    padding: 8,
    fontSize: 14,
  },
  mediaTypeContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(229,9,20,0.8)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  mediaTypeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  ratingContainer: {
  position: 'absolute',
  top: 8,
  left: 8,
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.6)',
  paddingHorizontal: 6,
  paddingVertical: 3,
  borderRadius: 5,
},

  resultRating: {
    top: 'auto',
    bottom: 10,
    left: 10,
  },
 ratingText: {
  color: '#FFF',
  fontSize: 12,
  marginLeft: 4,
},

  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    color: '#CCC',
    fontSize: 18,
  },
  logoutButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 20,
    right: 20,
    backgroundColor: '#E50914',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
});