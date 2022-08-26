import React, { useState } from 'react';
import FontistoIcons from '@expo/vector-icons/Fontisto';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as WebBrowser from 'expo-web-browser';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { StackerNews } from '~/services/api';
import useTailwind from '~/hooks/useTailwind';
import PostDesc from '~/components/PostDesc';
import PostUrl from '~/components/PostUrl';
import PostMarkdown from '~/components/PostMarkdown';
import { useStores } from '~/stores';
import Comment from '~/components/Comment';
import Container from '~/components/Container';
import { observer } from 'mobx-react-lite';
import PollView from '~/components/PollView';

export default PostScreen = observer(({ route, navigation }) => {
  const { tw } = useTailwind();
  const { postStore, uiStore } = useStores();
  const { id, cid } = route.params;
  const { data, isLoading } = StackerNews.post(id);
  const [ref, setRef] = useState(null);

  React.useEffect(() => {
    console.log(uiStore.commentY);
    ref?.scrollTo({
      x: 0,
      y: uiStore.commentY,
      animated: true,
    });
  }, [uiStore.commentY]);

  return (
    <Container>
      <View
        style={tw`py-2 dark:bg-black bg-[#EFEFEF] flex-row justify-between items-center border-b border-zinc-200 dark:border-zinc-900`}>
        <TouchableOpacity
          style={tw`px-2 mr-4`}
          onPress={() => {
            navigation.goBack();
          }}>
          <Ionicons size={28} style={tw`text-gray-600 dark:text-neutral-100`} name="arrow-back-outline" />
        </TouchableOpacity>
        <View style={tw`flex-1 items-center`}>
          <Text style={tw`dark:text-white font-medium text-base`}>Post</Text>
        </View>
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity
            onPress={() => {
              postStore.toggleFavPosts({ pid: id, title: data?.item?.title });
            }}>
            <FontAwesome
              size={22}
              style={tw`pr-2 text-gray-600 dark:text-neutral-100`}
              name={`${postStore.isFavPost(id) ? 'star' : 'star-o'}`}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              WebBrowser.openBrowserAsync(`https://stacker.news/items/${route.params.id}`);
            }}>
            <FontistoIcons size={20} name="world-o" style={tw`px-2 text-gray-600 dark:text-neutral-100`} />
          </TouchableOpacity>
        </View>
      </View>
      {isLoading ? (
        <ActivityIndicator color="#c9c9c9" style={tw`mt-2`} size="large" />
      ) : (
        <ScrollView
          scrollToOverflowEnabled={true}
          style={tw`flex-1 p-2`}
          scrollIndicatorInsets={{ right: 1 }}
          ref={(ref) => {
            setRef(ref);
          }}>
          <Text style={tw`text-base text-neutral-800 dark:text-gray-50 font-semibold px-2`}>{data.item.title}</Text>
          <View style={tw`px-2`}>
            <PostUrl url={data.item.url} />
            <PostDesc item={data.item} />
          </View>
          <PostMarkdown text={data.item.text} style={tw`mt-2 px-2`} />
          <PollView poll={data.item?.poll} />

          {data.item.comments.map((it) => {
            return <Comment item={it} key={it.id} idx={0} cid={cid} />;
          })}

          <View style={tw`mb-5`}>
            <Text style={tw`text-center py-5 dark:text-gray-50`}>END</Text>
          </View>
        </ScrollView>
      )}
    </Container>
  );
});
